import { DateTime } from 'luxon';
import {
  Answer,
  AssessmentResponse,
  AssessmentSubmission,
  CurriculumAssessment,
  FacilitatorAssessmentSubmissionsSummary,
  ParticipantAssessmentSubmissionsSummary,
  ProgramAssessment,
  Question,
} from '../models';
import db from './db';
import { findProgram, listProgramsForCurriculum } from './programsService';

// Helper functions

/**
 * Determines whether or not a specific program assessment submission has
 * expired and is no longer allowed to be updated by the participant.
 *
 * @param assessmentSubmission - The assessment submission to check for
 *   expiration, passed as an AssessmentSubmission object.
 * @returns {Promise<boolean>} If true, a participant should be prevented from
 *   submitting any updates to their program assessment submission, other than
 *   to mark it as "Expired" instead of "Opened" or "In Progress".
 */
const assessmentSubmissionExpired = async (
  assessmentSubmission: AssessmentSubmission
): Promise<boolean> => {
  const programAssessment = await findProgramAssessment(
    assessmentSubmission.assessment_id
  );
  const curriculumAssessment = await getCurriculumAssessment(
    programAssessment.assessment_id,
    false,
    false
  );

  // State 1: Past program assessment due date
  if (DateTime.now() > DateTime.fromISO(programAssessment.due_date)) {
    return true;
  }

  // State 2: Past expiration time
  if (
    curriculumAssessment.time_limit &&
    typeof curriculumAssessment.time_limit === 'number' &&
    curriculumAssessment.time_limit > 0
  ) {
    const endTime = DateTime.fromISO(assessmentSubmission.opened_at).plus({
      minutes: curriculumAssessment.time_limit,
    });
    if (DateTime.now() >= endTime) {
      return true;
    }
  }

  return false;
};

/**
 * Calculates the total number of participants in a program that have started or
 * completed *any* submission for a given program assessment.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<number>} The number of program participants with one or
 *   more submissions for that program assessment.
 */
const calculateNumParticipantsWithSubmissions = async (
  programAssessmentId: number
): Promise<number> => {
  const [numParticipantsWithSubmissions] = await db('assessment_submissions')
    .where('assessment_id', programAssessmentId)
    .countDistinct({ count: 'principal_id' });

  return numParticipantsWithSubmissions.count;
};

/**
 * Calculates the total number of participants enrolled in a program, excluding
 * any program facilitators.
 *
 * @param {number} programId - The row ID of the programs table for a given
 *   program.
 * @returns {Promise<number>} The number of program participants in that
 *   program.
 */
const calculateNumProgramParticipants = async (
  programId: number
): Promise<number> => {
  const [matchingProgramParticipantsResults] = await db('program_participants')
    .where('program_id', programId)
    .andWhere('role_id', 2)
    .count({ count: 'id' });

  return matchingProgramParticipantsResults.count;
};

/**
 * Calculates the total number of assessment submissions that have yet to be
 * graded for a given program assessment.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<number>} The number of assessment submissions that have
 *   been submitted but not graded.
 */
const calculateNumUngradedSubmissions = async (
  programAssessmentId: number
): Promise<number> => {
  const [numUngradedSubmissions] = await db('assessment_submissions')
    .where('assessment_id', programAssessmentId)
    .andWhere('score', null)
    .count({ count: 'id' });

  return numUngradedSubmissions.count;
};

/**
 * Inserts a question for an existing curriculum assessment into the
 * assessment_questions table.
 *
 * @param {number} curriculumAssessmentId - The curriculum assessment to which
 *   we are adding this question.
 * @param {Question} question - An object containing the question, its metadata,
 *   and any possible answers.
 * @returns {Promise<Question>} The updated Question object that was handed to
 *   us but with updated row IDs for the question and all answers given to us.
 */
const createAssessmentQuestion = async (
  curriculumAssessmentId: number,
  question: Question
): Promise<Question> => {
  const [insertedAssessmentQuestionId] = await db(
    'assessment_questions'
  ).insert({
    assessment_id: curriculumAssessmentId,
    title: question.title,
    description: question.description,
    question_type_id: question.question_type === 'single choice' ? 1 : 2,
    max_score: question.max_score,
    sort_order: question.sort_order,
  });

  const insertedAnswers: Answer[] = [];
  let correctAnswerId;

  for (const assessmentAnswer of question.answers) {
    const insertedAnswer = await createAssessmentQuestionAnswer(
      insertedAssessmentQuestionId,
      assessmentAnswer
    );

    if (question.question_type === 'single choice') {
      if (insertedAnswer.correct_answer === true) {
        correctAnswerId = insertedAnswer.id;
      }
    } else if (question.question_type === 'free response') {
      correctAnswerId = insertedAnswer.id;
    }
    insertedAnswers.push(insertedAnswer);
  }

  const updatedAssessmentQuestion = {
    ...question,
    id: insertedAssessmentQuestionId,
    answers: insertedAnswers,
  };

  if (correctAnswerId) {
    await db('assessment_questions')
      .update('correct_answer_id', correctAnswerId)
      .where('id', insertedAssessmentQuestionId);
    updatedAssessmentQuestion.correct_answer_id = correctAnswerId;
  }

  return updatedAssessmentQuestion;
};

/**
 * Inserts an answer for an existing curriculum assessment question into the
 * assessment_answers table.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for
 *   a given question.
 * @param {Answer} answer - An object containing an answer option and its
 *   metadata.
 * @returns {Promise<Answer>} The updated Answer object that was handed to us
 *   but with row ID specified.
 */
const createAssessmentQuestionAnswer = async (
  questionId: number,
  answer: Answer
): Promise<Answer> => {
  const [insertedAssessmentAnswersId] = await db('assessment_answers').insert({
    question_id: questionId,
    title: answer.title,
    description: answer.description,
    sort_order: answer.sort_order,
  });

  const updatedAssessmentAnswer = {
    ...answer,
    question_id: questionId,
    id: insertedAssessmentAnswersId,
  };

  return updatedAssessmentAnswer;
};

/**
 * Inserts a response for a user for a given curriculum assessment question into
 * the assessment_responses table.
 *
 * @param {AssessmentResponse} assessmentResponse - An object containing the
 * assessment response data.
 * @returns {Promise<AssessmentResponse>} The updated AssessmentResponse object
 * that was handed to us but with row ID specified.
 */
const createSubmissionResponse = async (
  assessmentResponse: AssessmentResponse
): Promise<AssessmentResponse> => {
  // TODO: Check to see if question relates to submission,
  // answer relates to question?
  const [newSubmissionId] = await db('assessment_responses').insert({
    assessment_id: assessmentResponse.assessment_id,
    submission_id: assessmentResponse.submission_id,
    question_id: assessmentResponse.question_id,
    answer_id: assessmentResponse.answer_id,
    response: assessmentResponse.response_text,
  });

  return {
    id: newSubmissionId,
    assessment_id: assessmentResponse.assessment_id,
    submission_id: assessmentResponse.submission_id,
    question_id: assessmentResponse.question_id,
    answer_id: assessmentResponse.answer_id,
    response: assessmentResponse.response_text,
  } as AssessmentResponse;
};

/**
 * Removes an existing question from a curriculum assessment without deleting
 * the entire assessment.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for
 *   a given question.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
const deleteAssessmentQuestion = async (questionId: number): Promise<void> => {
  return db('assessment_questions').where('id', questionId).delete();
};

/**
 * Removes an existing answer option from a curriculum assessment question
 * without deleting the question.
 *
 * @param {number} answerId - The row ID of the assessment_answers table for a
 *   given answer.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
const deleteAssessmentQuestionAnswer = async (
  answerId: number
): Promise<void> => {
  return db('assessment_answers').where('id', answerId).delete();
};

/**
 * Lists all possible answer options for a given curriculum assessment question.
 * If specified, will also return metadata indicating which answer option is
 * correct.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for
 *   a given question.
 * @returns {Promise<Answer[]>} An array of Answer options, including or
 *   omitting the correct answer metadata as specified.
 */
const listAssessmentQuestionAnswers = async (
  questionId: number
): Promise<Answer[]> => {
  const assessmentAnswersList = await db('assessment_answers')
    .select('id', 'question_id', 'title', 'description', 'sort_order')
    .where('question_id', questionId)
    .orderBy('sort_order', 'asc');

  return assessmentAnswersList;
};

/**
 * Lists all questions of a given curriculum assessment. Based on specified
 * boolean parameter, will also return metadata indicating the correct answer
 * option. Note that for free response questions, this function will not return
 * any answers unless correctAnswersIncluded is set to true.
 *
 * @param {number} curriculumAssessmentId - The row ID of the
 *   curriculum_assessments table for a given curriculum assessment.
 * @param {boolean} [correctAnswersIncluded] - Optional specifier to determine
 *   whether or not the correct answer information should be included or removed
 *   from the return value.
 * @returns {Promise<Question[]>} An array of Question objects, including or
 *   omitting the correct answer metadata as specified.
 */
export const listAssessmentQuestions = async (
  curriculumAssessmentId: number,
  correctAnswersIncluded?: boolean
): Promise<Question[]> => {
  const matchingAssessmentQuestionsRows = await db('assessment_questions')
    .join(
      'assessment_question_types',
      'assessment_questions.question_type_id',
      'assessment_question_types.id'
    )
    .select(
      'assessment_questions.id',
      'assessment_questions.title',
      'description',
      'assessment_question_types.title as question_type',
      'correct_answer_id',
      'max_score',
      'sort_order'
    )
    .where('assessment_questions.assessment_id', curriculumAssessmentId)
    .orderBy('sort_order', 'asc');

  if (matchingAssessmentQuestionsRows.length === 0) {
    return null;
  }

  const assessmentQuestions: Question[] = [];

  for (const assessmentQuestionsRow of matchingAssessmentQuestionsRows) {
    const assessmentQuestion: Question = {
      id: assessmentQuestionsRow.id,
      assessment_id: curriculumAssessmentId,
      title: assessmentQuestionsRow.title,
      description: assessmentQuestionsRow.description,
      question_type: assessmentQuestionsRow.question_type,
      max_score: assessmentQuestionsRow.max_score,
      sort_order: assessmentQuestionsRow.sort_order,
      answers: await listAssessmentQuestionAnswers(assessmentQuestionsRow.id),
    };

    if (correctAnswersIncluded) {
      assessmentQuestion.correct_answer_id =
        assessmentQuestionsRow.correct_answer_id;
      const correctAnswer = assessmentQuestion.answers.find(
        answer => answer.id === assessmentQuestionsRow.correct_answer_id
      );
      if (correctAnswer) {
        correctAnswer.correct_answer = true;
      }
    }

    assessmentQuestions.push(assessmentQuestion);
  }

  return assessmentQuestions;
};

/**
 * Lists all responses from a given assessment submission by a program
 * participant. Based on specified boolean parameter, will also include the
 * score and any grader response as well.
 *
 * @param {number} submissionId - The row ID of the assessment_submissions table
 *   for a given program assessment submission.
 * @param {boolean} [gradingsIncluded] - Optional specifier to determine whether
 *   or not the grading information (score, grader response) should be included
 *   or removed from the return value.
 * @returns {Promise<AssessmentResponse[]>} An array of AssessmentResponse
 *   objects, including or omitting the grading information as specified.
 */
const listSubmissionResponses = async (
  submissionId: number,
  gradingsIncluded?: boolean
): Promise<AssessmentResponse[]> => {
  const matchingAssessmentResponsesRows = await db('assessment_responses')
    .select(
      'id',
      'assessment_id',
      'question_id',
      'answer_id',
      'response',
      'score',
      'grader_response'
    )
    .where('submission_id', submissionId);

  if (matchingAssessmentResponsesRows.length === 0) {
    return null;
  }

  const assessmentResponses: AssessmentResponse[] =
    matchingAssessmentResponsesRows.map(assessmentResponsesRow => {
      const assessmentResponse: AssessmentResponse = {
        id: assessmentResponsesRow.id,
        assessment_id: assessmentResponsesRow.assessment_id,
        submission_id: submissionId,
        question_id: assessmentResponsesRow.question_id,
      };

      if (
        assessmentResponsesRow.answer_id === null &&
        assessmentResponsesRow.response !== null
      ) {
        assessmentResponse.response_text = assessmentResponsesRow.response;
      } else if (assessmentResponsesRow.answer_id !== null) {
        assessmentResponse.answer_id = assessmentResponsesRow.answer_id;
      }

      if (gradingsIncluded && gradingsIncluded === true) {
        assessmentResponse.score = assessmentResponsesRow.score;
        assessmentResponse.grader_response =
          assessmentResponsesRow.grader_response;
      }

      return assessmentResponse;
    });

  return assessmentResponses;
};

/**
 * Updates an existing curriculum assessment question with new answer options or
 * new metadata.
 *
 * @param {Question} question - The Question object for a given curriculum
 *   assessment question with updated information.
 * @returns {Promise<Question>} The updated Question object, including created
 *   or updated Answer objects, if any.
 */
const updateAssessmentQuestion = async (
  question: Question
): Promise<Question> => {
  let correctAnswerId = question.correct_answer_id;
  const updatedAnswers = [];
  const updatedQuestion = {
    ...question,
  };

  // TODO: deleteAssessmentQuestionAnswer() for any answers that no longer exist
  if (question.answers !== null) {
    for (const answer of question.answers) {
      if (typeof answer.id === 'undefined') {
        // the answer is new
        const newAnswer = await createAssessmentQuestionAnswer(
          question.id,
          answer
        );
        correctAnswerId =
          newAnswer.correct_answer && newAnswer.correct_answer === true
            ? newAnswer.id
            : correctAnswerId;
        updatedAnswers.push(newAnswer);
      } else {
        // the answer was updated
        const updatedAnswer = await updateAssessmentQuestionAnswer(answer);
        correctAnswerId =
          updatedAnswer.correct_answer && updatedAnswer.correct_answer === true
            ? updatedAnswer.id
            : correctAnswerId;
        updatedAnswers.push(updatedAnswer);
      }
    }
  }
  if (question.answers && Array.isArray(question) && question.length > 0) {
    for (const deletedAnswer of question.answers) {
      await deleteAssessmentQuestionAnswer(deletedAnswer.id);
    }
  }

  updatedQuestion.answers = updatedAnswers;
  updatedQuestion.correct_answer_id = correctAnswerId;

  await db('assessment_questions')
    .update({
      title: question.title,
      description: question.description,
      correct_answer_id: correctAnswerId,
      max_score: question.max_score,
      sort_order: question.sort_order,
    })
    .where('id', question.id);
  return updatedQuestion;
};

/**
 * Updates an existing answer option for a curriculum assessment question with
 * new metadata.
 *
 * @param {Answer} answer - The Answer object for a given curriculum assessment
 *   question answer option with updated information.
 * @returns {Promise<Answer>} The updated Answer object.
 */
const updateAssessmentQuestionAnswer = async (
  answer: Answer
): Promise<Answer> => {
  await db('assessment_answers')
    .update({
      title: answer.title,
      description: answer.description,
      sort_order: answer.sort_order,
    })
    .where('id', answer.id);
  return answer;
};

/**
 * Updates an existing assessment submission response with updated metadata.
 *
 * @param {AssessmentResponse} assessmentResponse - The AssessmentResponse
 *   object for a given program assessment submission response with updated
 *   information.
 * @param {boolean} [facilitatorGrading] - Optional specifier for when the
 *   program facilitator is the one updating a program assessment submission response,
 *   they are allowed to modify the score, and grader response.
 * @returns {Promise<AssessmentResponse>} The updated AssessmentResponse object.
 */
const updateSubmissionResponse = async (
  assessmentResponse: AssessmentResponse,
  facilitatorGrading?: boolean
): Promise<AssessmentResponse> => {
  // TODO: Check to see if question relates to submission,
  // answer relates to question?
  if (facilitatorGrading && facilitatorGrading === true) {
    await db('assessment_responses')
      .update({
        score: assessmentResponse.score,
        grader_response: assessmentResponse.grader_response,
      })
      .where('id', assessmentResponse.id);
  } else {
    await db('assessment_responses')
      .update({
        answer_id: assessmentResponse.answer_id,
        response: assessmentResponse.response_text,
      })
      .where('id', assessmentResponse.id);
  }

  return assessmentResponse;
};

// Callable from router

/**
 * Gathers the relevant information for constructing a
 * FacilitatorAssessmentSubmissionsSummary for a given program assessment.
 *
 * @param {number} programAssessment - The program assessment for which we're
 *   constructing a summary.
 * @returns {Promise<FacilitatorAssessmentSubmissionsSummary>} The program
 *   assessment submissions summary information for use by a program
 *   facilitator.
 */
export const constructFacilitatorAssessmentSummary = async (
  programAssessment: ProgramAssessment
): Promise<FacilitatorAssessmentSubmissionsSummary> => {
  const numParticipantsWithSubmissions =
    await calculateNumParticipantsWithSubmissions(programAssessment.id);
  const numProgramParticipants = await calculateNumProgramParticipants(
    programAssessment.program_id
  );
  const numUngradedSubmissions = await calculateNumUngradedSubmissions(
    programAssessment.id
  );

  const facilitatorAssessmentSummary: FacilitatorAssessmentSubmissionsSummary =
    {
      num_participants_with_submissions: numParticipantsWithSubmissions,
      num_program_participants: numProgramParticipants,
      num_ungraded_submissions: numUngradedSubmissions,
    };

  return facilitatorAssessmentSummary;
};

/**
 * Gathers the relevant information for constructing a
 * ParticipantAssessmentSubmissionsSummary for a given participant principal ID
 * and a given program assessment.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table
 *   that corresponds with a given program participant.
 * @param {number} programAssessment - The program assessment for which we're
 *   constructing a summary.
 * @returns {Promise<ParticipantAssessmentSubmissionsSummary>} The program
 *   assessment submissions summary information for use by a program
 *   participant.
 */
export const constructParticipantAssessmentSummary = async (
  participantPrincipalId: number,
  programAssessment: ProgramAssessment
): Promise<ParticipantAssessmentSubmissionsSummary> => {
  const assessmentActiveDate = DateTime.fromISO(
    programAssessment.available_after
  );
  const assessmentDueDate = DateTime.fromISO(programAssessment.due_date);

  let highestState;

  const highestStateFromDB = await db('assessment_submissions')
    .select('assessment_submission_states.title')
    .join(
      'assessment_submission_states',
      'assessment_submission_states.id',
      'assessment_submissions.assessment_submission_state_id'
    )
    .where('assessment_submissions.principal_id', participantPrincipalId)
    .andWhere('assessment_submissions.assessment_id', programAssessment.id)
    .orderBy('assessment_submissions.assessment_submission_state_id', 'desc')
    .limit(1);

  if (highestStateFromDB.length === 0) {
    if (
      DateTime.now() >= assessmentActiveDate &&
      DateTime.now() < assessmentDueDate
    ) {
      highestState = 'Active';
    } else if (DateTime.now() < assessmentActiveDate) {
      highestState = 'Inactive';
    } else if (DateTime.now() >= assessmentDueDate) {
      highestState = 'Expired';
    }
  } else {
    highestState = highestStateFromDB[0].title;
  }

  let mostRecentSubmittedDate;
  const mostRecentSubmittedDateFromDB = await db('assessment_submissions')
    .select('submitted_at')
    .where('principal_id', participantPrincipalId)
    .andWhere('assessment_id', programAssessment.id)
    .orderBy('submitted_at', 'desc')
    .limit(1);

  if (mostRecentSubmittedDateFromDB.length === 0) {
    mostRecentSubmittedDate = null;
  } else {
    mostRecentSubmittedDate = DateTime.fromSQL(
      mostRecentSubmittedDateFromDB[0].submitted_at,
      { zone: 'utc' }
    ).toISO();
  }

  const totalNumSubmissions = await listParticipantProgramAssessmentSubmissions(
    participantPrincipalId,
    programAssessment.id
  );

  let highestScore;
  const highestScoreFromDB = await db('assessment_submissions')
    .select('score')
    .where('principal_id', participantPrincipalId)
    .andWhere('assessment_id', programAssessment.id)
    .orderBy('score', 'desc')
    .limit(1);

  if (highestScoreFromDB.length === 0) {
    highestScore = null;
  } else {
    highestScore = highestScoreFromDB[0].score;
  }

  const participantAssessmentSummary: ParticipantAssessmentSubmissionsSummary =
    {
      principal_id: participantPrincipalId,
      highest_state: highestState,
      total_num_submissions: totalNumSubmissions
        ? totalNumSubmissions.length
        : 0,
    };

  if (mostRecentSubmittedDate !== null) {
    participantAssessmentSummary.most_recent_submitted_date =
      mostRecentSubmittedDate;
  }

  if (highestScore !== null) {
    participantAssessmentSummary.highest_score = highestScore;
  }

  return participantAssessmentSummary;
};

/**
 * Begins a new program assessment submission for a program participant, if they
 * have not exceeded the maximum number of allowed submissions for that
 * assessment and no other assessment submissions are in progress by that
 * program participant for that program assessment.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table
 *   that corresponds with a given program participant.
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<AssessmentSubmission>} An AssessmentSubmission object
 *   constructed from the inserted row in the assessment_submissions table.
 */
export const createAssessmentSubmission = async (
  participantPrincipalId: number,
  programAssessmentId: number,
  curriculumAssessmentId: number
): Promise<AssessmentSubmission> => {
  const openedStateTitle = 'Opened';
  const [openedStateId] = await db('assessment_submission_states')
    .select('id')
    .where('title', openedStateTitle);

  const [newSubmissionId] = await db('assessment_submissions').insert({
    assessment_id: programAssessmentId,
    principal_id: participantPrincipalId,
    assessment_submission_state_id: openedStateId.id,
  });

  const assessmentQuestionIds = await db('assessment_questions')
    .select('id')
    .where({ assessment_id: curriculumAssessmentId });

  const submissionResponses: AssessmentResponse[] = [];

  for (const question of assessmentQuestionIds) {
    const response = await createSubmissionResponse({
      assessment_id: programAssessmentId,
      submission_id: newSubmissionId,
      question_id: question.id,
    });

    submissionResponses.push(response);
  }

  const newSubmission: AssessmentSubmission = {
    id: newSubmissionId,
    assessment_id: programAssessmentId,
    principal_id: participantPrincipalId,
    assessment_submission_state: openedStateTitle,
    opened_at: DateTime.now().toISO(),
    last_modified: DateTime.now().toISO(),
    responses: submissionResponses,
  };

  return newSubmission;
};

/**
 * Creates a new curriculum assessment in the curriculum_assessments table,
 * linked with a given curriculum activity.
 *
 * @param {CurriculumAssessment} curriculumAssessment - The CurriculumAssessment
 *   object for the new curriculum assessment data to be inserted.
 * @returns {Promise<CurriculumAssessment>} The updated CurriculumAssessment
 *   object that was handed to us, but with row ID specified.
 */
export const createCurriculumAssessment = async (
  curriculumAssessment: CurriculumAssessment
): Promise<CurriculumAssessment> => {
  const [insertedCurriculumAssessmentRowId] = await db(
    'curriculum_assessments'
  ).insert({
    title: curriculumAssessment.title,
    description: curriculumAssessment.description,
    max_score: curriculumAssessment.max_score,
    max_num_submissions: curriculumAssessment.max_num_submissions,
    time_limit: curriculumAssessment.time_limit,
    curriculum_id: curriculumAssessment.curriculum_id,
    activity_id: curriculumAssessment.activity_id,
    principal_id: curriculumAssessment.principal_id,
  });

  const insertedQuestions: Question[] = [];

  if (typeof curriculumAssessment.questions !== 'undefined') {
    for (const assessmentQuestion of curriculumAssessment.questions) {
      insertedQuestions.push(
        await createAssessmentQuestion(
          insertedCurriculumAssessmentRowId,
          assessmentQuestion
        )
      );
    }
  }

  const updatedCurriculumAssessment: CurriculumAssessment = {
    ...curriculumAssessment,
    id: insertedCurriculumAssessmentRowId,
  };

  if (insertedQuestions.length > 0) {
    updatedCurriculumAssessment.questions = insertedQuestions;
  }

  return updatedCurriculumAssessment;
};

/**
 * Creates a new program assessment in the program_assessments table, linked
 * with a given curriculum assessment.
 *
 * @param {ProgramAssessment} programAssessment - The ProgramAssessment object
 *   for the new program assessment data to be inserted.
 * @returns {Promise<ProgramAssessment>} The updated ProgramAssessment object
 *   that was handed to us, but with row ID specified.
 */
export const createProgramAssessment = async (
  programAssessment: ProgramAssessment
): Promise<ProgramAssessment> => {
  const [insertedProgramAssessmentRowId] = await db(
    'program_assessments'
  ).insert({
    program_id: programAssessment.program_id,
    assessment_id: programAssessment.assessment_id,
    available_after: programAssessment.available_after,
    due_date: programAssessment.due_date,
  });

  const program = await findProgram(programAssessment.program_id);

  const updatedProgramAssessment: ProgramAssessment = {
    ...programAssessment,
    id: insertedProgramAssessmentRowId,
    available_after: DateTime.fromSQL(programAssessment.available_after, {
      zone: program.time_zone,
    }).toISO(),
    due_date: DateTime.fromSQL(programAssessment.due_date, {
      zone: program.time_zone,
    }).toISO(),
  };

  return updatedProgramAssessment;
};

/**
 * Deletes a given curriculum assessment, all associated program assessments,
 * and all associated questions and answers for a given curriculum assessment.
 * This function fails to execute if there has ever been an assessment
 * submission for the questions and answers in this curriculum assessment.
 *
 * @param {number} curriculumAssessmentId - The row ID of the
 *   curriculum_assessments table for a given curriculum assessment.
 * @returns {Promise<number>} Returns nothing if the deletion was successful.
 */
export const deleteCurriculumAssessment = async (
  curriculumAssessmentId: number
): Promise<number> => {
  return db('curriculum_assessments')
    .where('id', curriculumAssessmentId)
    .delete();
};

/**
 * Deletes a given program assessment, but leaves the curriculum assessment, its
 * questions, and its answers intact. This function fails to execute if there
 * has ever been an assessment submission for this program assessment by a
 * program participant.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<number>} Returns nothing if the deletion was successful.
 */
export const deleteProgramAssessment = async (
  programAssessmentId: number
): Promise<number> => {
  return db('program_assessments').where('id', programAssessmentId).delete();
};

/**
 * Finds a single program assessment by its row ID, if it exists in the
 * program_assessments table.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<ProgramAssessment>} The ProgramAssessment representation of
 *   that program assessment, or null if no matching program assessment was
 *   found.
 */
export const findProgramAssessment = async (
  programAssessmentId: number
): Promise<ProgramAssessment> => {
  const matchingProgramAssessmentsRows = await db('program_assessments')
    .select('program_id', 'assessment_id', 'available_after', 'due_date')
    .where('id', programAssessmentId);

  if (matchingProgramAssessmentsRows.length === 0) {
    return null;
  }

  const [programAssessmentsRow] = matchingProgramAssessmentsRows;

  const program = await findProgram(programAssessmentsRow.program_id);

  const programAssessment: ProgramAssessment = {
    id: programAssessmentId,
    program_id: programAssessmentsRow.program_id,
    assessment_id: programAssessmentsRow.assessment_id,
    available_after: DateTime.fromSQL(programAssessmentsRow.available_after, {
      zone: program.time_zone,
    }).toISO(),
    due_date: DateTime.fromSQL(programAssessmentsRow.due_date, {
      zone: program.time_zone,
    }).toISO(),
  };

  return programAssessment;
};

/**
 * Finds a single program assessment submission by its row ID, if it exists in
 * the assessment_submissions table. Optionally returns the submission's saved
 * responses and the grading information for the submission and its responses.
 *
 * @param {number} assessmentSubmissionId - The row ID of the
 *   assessment_submissions table for a given program assessment submission.
 * @param {boolean} [responsesIncluded] - Optional specifier to determine
 *   whether or not the assessment responses will be included in the returned
 *   object.
 * @param {boolean} [gradingsIncluded] - Optional specifier to override the
 *   default grading information return behavior, such as if a program
 *   facilitator was retrieving the assessment submission. If this parameter is
 *   not specified, the default behavior will take over: the grading information
 *   will only be released if the assessment submission is in the "Graded"
 *   state.
 * @returns {Promise<AssessmentSubmission>} The AssessmentSubmission
 *   representation of that program assessment submission, or null if no
 *   matching program assessment submission was found.
 */
export const getAssessmentSubmission = async (
  assessmentSubmissionId: number,
  responsesIncluded?: boolean,
  gradingsIncluded?: boolean
): Promise<AssessmentSubmission> => {
  const matchingAssessmentSubmissionsRows = await db('assessment_submissions')
    .join(
      'assessment_submission_states',
      'assessment_submissions.assessment_submission_state_id',
      'assessment_submission_states.id'
    )
    .select(
      'assessment_submissions.assessment_id',
      'assessment_submissions.principal_id',
      'assessment_submission_states.title as assessment_submission_state',
      'assessment_submissions.score',
      'assessment_submissions.opened_at',
      'assessment_submissions.submitted_at',
      'assessment_submissions.updated_at'
    )
    .where('assessment_submissions.id', assessmentSubmissionId);

  if (matchingAssessmentSubmissionsRows.length === 0) {
    return null;
  }

  const [assessmentSubmissionsRow] = matchingAssessmentSubmissionsRows;

  const assessmentSubmission: AssessmentSubmission = {
    id: assessmentSubmissionId,
    assessment_id: assessmentSubmissionsRow.assessment_id,
    principal_id: assessmentSubmissionsRow.principal_id,
    assessment_submission_state:
      assessmentSubmissionsRow.assessment_submission_state,
    opened_at: DateTime.fromSQL(assessmentSubmissionsRow.opened_at, {
      zone: 'utc',
    }).toISO(),
    last_modified: DateTime.fromSQL(assessmentSubmissionsRow.updated_at, {
      zone: 'utc',
    }).toISO(),
  };

  if (assessmentSubmissionsRow.score !== null) {
    assessmentSubmission.score = assessmentSubmissionsRow.score;
  }

  if (assessmentSubmissionsRow.submitted_at !== null) {
    assessmentSubmission.submitted_at = DateTime.fromSQL(
      assessmentSubmissionsRow.submitted_at,
      {
        zone: 'utc',
      }
    ).toISO();
  }

  if (responsesIncluded) {
    const assessmentResponses = await listSubmissionResponses(
      assessmentSubmissionId,
      gradingsIncluded
    );
    if (assessmentResponses !== null) {
      assessmentSubmission.responses = assessmentResponses;
    }
  }
  return assessmentSubmission;
};

/**
 * Finds a single curriculum assessment by its row ID, if it exists in the
 * curriculum_assessments table. Optionally returns the questions and all answer
 * options, such as when a participant is creating or viewing an assessment
 * submission, and the questions and correct answers, such as when a participant
 * is viewing a graded submission or a facilitator is grading a submission.
 *
 * @param {number} curriculumAssessmentId - The row ID of the
 *   curriculum_assessments table for a given curriculum assessment.
 * @param {boolean} [questionsAndAllAnswersIncluded] - Optional specifier to
 *   determine whether or not the questions and all answer options will be
 *   included in the returned object.
 * @param {boolean} [questionsAndCorrectAnswersIncluded] - Optional specifier to
 *   determine whether or not the correct answer information for the curriculum
 *   assessment questions will be included in the returned object.
 * @returns {Promise<CurriculumAssessment>} The CurriculumAssessment
 *   representation of that curriculum assessment, or null if no matching
 *   curriculum assessment was found.
 */
export const getCurriculumAssessment = async (
  curriculumAssessmentId: number,
  questionsAndAllAnswersIncluded?: boolean,
  questionsAndCorrectAnswersIncluded?: boolean
): Promise<CurriculumAssessment> => {
  const matchingCurriculumAssessmentRows = await db('curriculum_assessments')
    .select(
      'curriculum_assessments.title',
      'curriculum_assessments.max_score',
      'curriculum_assessments.max_num_submissions',
      'curriculum_assessments.time_limit',
      'curriculum_assessments.curriculum_id',
      'curriculum_assessments.activity_id',
      'curriculum_assessments.principal_id'
    )
    .join('activities', 'curriculum_assessments.curriculum_id', 'activities.id')
    .where('curriculum_assessments.id', curriculumAssessmentId);

  if (matchingCurriculumAssessmentRows.length === 0) {
    return null;
  }

  const [matchingCurriculumAssessment] = matchingCurriculumAssessmentRows;

  const [assessmentType] = await db('activity_types')
    .select('activity_types.title')
    .join('activities', 'activities.activity_type_id', 'activity_types.id')
    .where('activities.id', matchingCurriculumAssessment.activity_id);

  const curriculumAssessment: CurriculumAssessment = {
    id: curriculumAssessmentId,
    title: matchingCurriculumAssessment.title,
    assessment_type: assessmentType.title,
    description: matchingCurriculumAssessment.description,
    max_score: matchingCurriculumAssessment.max_score,
    max_num_submissions: matchingCurriculumAssessment.max_num_submissions,
    time_limit: matchingCurriculumAssessment.time_limit,
    curriculum_id: matchingCurriculumAssessment.curriculum_id,
    activity_id: matchingCurriculumAssessment.activity_id,
    principal_id: matchingCurriculumAssessment.principal_id,
  };

  if (questionsAndAllAnswersIncluded === true) {
    curriculumAssessment.questions = await listAssessmentQuestions(
      curriculumAssessmentId,
      questionsAndCorrectAnswersIncluded
    );
  }

  return curriculumAssessment;
};

/**
 * Retrieves the string representation of a principal's role for a given
 * program: "Facilitator" for a program facilitator, "Participant" for a program
 * participant, or null if not enrolled in the specified program.
 *
 * @param {number} principalId - The row ID of the principals table that
 *   corresponds with a given program member.
 * @param {number} programId - The row ID of the programs table for a given
 *   program.
 * @returns {Promise<string>} The string value of a principal's role in a given
 *   program, or null if they are not enrolled as a participant or facilitating
 *   that program.
 */
export const getPrincipalProgramRole = async (
  principalId: number,
  programId: number
): Promise<string> => {
  const matchingRoleRows = await db('program_participant_roles')
    .select('program_participant_roles.title')
    .join(
      'program_participants',
      'program_participant_roles.id',
      'program_participants.role_id'
    )
    .where({ principal_id: principalId, program_id: programId });

  if (matchingRoleRows.length === 0) {
    return null;
  }

  const [matchingRole] = matchingRoleRows;

  return matchingRole.title;
};

/**
 * Lists all submissions by all program participants for a given program
 * assessment, if any. Does not include responses for those submissions.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<AssessmentSubmission[]>} An array of AssessmentSubmission
 *   objects constructed from matching program assessment submissions, if any,
 *   not including their responses.
 */
export const listAllProgramAssessmentSubmissions = async (
  programAssessmentId: number
): Promise<AssessmentSubmission[]> => {
  const matchingAssessmentSubmissionsRows = await db('assessment_submissions')
    .join(
      'assessment_submission_states',
      'assessment_submissions.assessment_submission_state_id',
      'assessment_submission_states.id'
    )
    .select(
      'assessment_submissions.id',
      'assessment_submission_states.title as assessment_submission_state',
      'assessment_submissions.principal_id',
      'assessment_submissions.score',
      'assessment_submissions.opened_at',
      'assessment_submissions.submitted_at',
      'assessment_submissions.updated_at'
    )
    .where('assessment_id', programAssessmentId);

  if (matchingAssessmentSubmissionsRows.length === 0) {
    return null;
  }

  const assessmentSubmissions: AssessmentSubmission[] = [];

  for (const assessmentSubmissionsRow of matchingAssessmentSubmissionsRows) {
    const assessmentSubmission: AssessmentSubmission = {
      id: assessmentSubmissionsRow.id,
      assessment_id: programAssessmentId,
      principal_id: assessmentSubmissionsRow.principal_id,
      assessment_submission_state:
        assessmentSubmissionsRow.assessment_submission_state,
      opened_at: DateTime.fromSQL(assessmentSubmissionsRow.opened_at, {
        zone: 'utc',
      }).toISO(),
      last_modified: DateTime.fromSQL(assessmentSubmissionsRow.updated_at, {
        zone: 'utc',
      }).toISO(),
    };

    if (assessmentSubmissionsRow.score !== null) {
      assessmentSubmission.score = assessmentSubmissionsRow.score;
    }

    if (assessmentSubmissionsRow.submitted_at !== null) {
      assessmentSubmission.submitted_at = DateTime.fromSQL(
        assessmentSubmissionsRow.submitted_at,
        { zone: 'utc' }
      ).toISO();
    }

    assessmentSubmissions.push(assessmentSubmission);
  }

  return assessmentSubmissions;
};

/**
 * Lists all submissions by a program participant for a given program
 * assessment, if any. Does not include responses for those submissions.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table
 *   that corresponds with a given program participant.
 * @param {number} programAssessmentId - The row ID of the program_assessments
 *   table for a given program assessment.
 * @returns {Promise<AssessmentSubmission[]>} An array of AssessmentSubmission
 *   objects constructed from matching program assessment submissions, if any,
 *   not including their responses.
 */
export const listParticipantProgramAssessmentSubmissions = async (
  participantPrincipalId: number,
  programAssessmentId: number
): Promise<AssessmentSubmission[]> => {
  const matchingAssessmentSubmissionsRows = await db('assessment_submissions')
    .join(
      'assessment_submission_states',
      'assessment_submissions.assessment_submission_state_id',
      'assessment_submission_states.id'
    )
    .select(
      'assessment_submissions.id as id',
      'assessment_submission_states.title as assessment_submission_state',
      'assessment_submissions.score',
      'assessment_submissions.opened_at',
      'assessment_submissions.submitted_at',
      'assessment_submissions.updated_at'
    )
    .where('assessment_submissions.principal_id', participantPrincipalId)
    .andWhere('assessment_submissions.assessment_id', programAssessmentId);

  if (matchingAssessmentSubmissionsRows.length === 0) {
    return null;
  }

  const assessmentSubmissions: AssessmentSubmission[] = [];

  for (const assessmentSubmissionsRow of matchingAssessmentSubmissionsRows) {
    const assessmentSubmission: AssessmentSubmission = {
      id: assessmentSubmissionsRow.id,
      assessment_id: programAssessmentId,
      principal_id: participantPrincipalId,
      assessment_submission_state:
        assessmentSubmissionsRow.assessment_submission_state,
      opened_at: DateTime.fromSQL(assessmentSubmissionsRow.opened_at, {
        zone: 'utc',
      }).toISO(),
      last_modified: DateTime.fromSQL(assessmentSubmissionsRow.updated_at, {
        zone: 'utc',
      }).toISO(),
    };

    if (assessmentSubmissionsRow.score !== null) {
      assessmentSubmission.score = assessmentSubmissionsRow.score;
    }

    if (assessmentSubmissionsRow.submitted_at !== null) {
      assessmentSubmission.submitted_at = DateTime.fromSQL(
        assessmentSubmissionsRow.submitted_at,
        { zone: 'utc' }
      ).toISO();
    }

    assessmentSubmissions.push(assessmentSubmission);
  }

  return assessmentSubmissions;
};

/**
 * Lists all row IDs of programs for which a principal is either enrolled as a
 * participant or is designated as facilitator.
 *
 * @param {number} principalId - The row ID of the principals table that
 *   corresponds with a given program member.
 * @returns {Promise<number[]>} An array of row IDs for all matching programs
 *   for which the user is enrolled or is facilitating.
 */
export const listPrincipalEnrolledProgramIds = async (
  principalId: number
): Promise<number[] | null> => {
  const enrolledProgramsList = await db('program_participants')
    .select('program_id')
    .where({ principal_id: principalId });

  if (enrolledProgramsList.length === 0) {
    return null;
  }

  const programList: number[] = enrolledProgramsList.map(
    enrolledProgram => enrolledProgram.program_id
  );

  return programList;
};

/**
 * Lists all available program assessments for a given program.
 *
 * @param {number} programId - The row ID of the programs table for a given
 *   program.
 * @returns {Promise<ProgramAssessment[]>} An array of the ProgramAssessment
 *   objects constructed from matching program assessments, if any.
 */
export const listProgramAssessments = async (
  programId: number
): Promise<ProgramAssessment[]> => {
  const matchingProgramAssessmentsRows = await db('program_assessments')
    .select('id', 'assessment_id', 'available_after', 'due_date')
    .where('program_id', programId);

  if (matchingProgramAssessmentsRows.length === 0) {
    return null;
  }

  const programAssessments: ProgramAssessment[] = [];

  for (const programAssessmentsRow of matchingProgramAssessmentsRows) {
    const program = await findProgram(programId);

    programAssessments.push({
      id: programAssessmentsRow.id,
      program_id: programId,
      assessment_id: programAssessmentsRow.assessment_id,
      available_after: DateTime.fromSQL(programAssessmentsRow.available_after, {
        zone: program.time_zone,
      }).toISO(),
      due_date: DateTime.fromSQL(programAssessmentsRow.due_date, {
        zone: program.time_zone,
      }).toISO(),
    });
  }

  return programAssessments;
};

/**
 * Retrieves all program IDs that a given user is a facilitator for, matching a
 * given curriculum ID. This is used for routes where we have a curriculum
 * assessment ID and do not have a way to check if a user is allowed to make
 * edits to that curriculum assessment.
 *
 * @param {number} principalId - The row ID of the principals table for the
 *   logged-in user.
 * @param {number} curriculumId - The row ID of the curriculums table
 *   corresponding to the curriculum assessment we will be retrieving,
 *   modifying, or deleting.
 * @returns {Promise<number[]>} An array of the row IDs of the programs table
 *   matching the given curriculum ID.
 */
export const facilitatorProgramIdsMatchingCurriculum = async (
  principalId: number,
  curriculumId: number
): Promise<number[]> => {
  const participatingProgramIds = await listPrincipalEnrolledProgramIds(
    principalId
  );

  if (participatingProgramIds === null) {
    return [];
  }

  const curriculumPrograms = await listProgramsForCurriculum(curriculumId);

  const matchingFacilitatorPrograms: number[] = [];

  for (const programId of participatingProgramIds) {
    const programRole = await getPrincipalProgramRole(principalId, programId);

    if (programRole === 'Facilitator') {
      if (
        curriculumPrograms.filter(program => program.id === programId)
          .length !== 0
      ) {
        matchingFacilitatorPrograms.push(programId);
      }
    }
  }

  return matchingFacilitatorPrograms;
};

/**
 * Removes any possible grading information from an assessment submission in
 * cases when we don't want to return that information to the requester.
 *
 * @param {AssessmentSubmission} assessmentSubmissionWithGrades - An
 *   AssessmentSubmission possibly containing grading information.
 * @returns {AssessmentSubmission} The updated object with any possible grading
 *   information removed, without harming the original object.
 */
export const removeGradingInformation = (
  assessmentSubmissionWithGrades: AssessmentSubmission
): AssessmentSubmission => {
  const gradeRemovedSubmission = { ...assessmentSubmissionWithGrades };
  delete gradeRemovedSubmission.score;

  if (assessmentSubmissionWithGrades.responses) {
    const gradeRemovedResponses = assessmentSubmissionWithGrades.responses.map(
      response => {
        const gradeRemovedResponse = structuredClone(response);
        delete gradeRemovedResponse.score;
        delete gradeRemovedResponse.grader_response;
        return gradeRemovedResponse;
      }
    );
    gradeRemovedSubmission.responses = gradeRemovedResponses;
  }

  return gradeRemovedSubmission;
};

/**
 * Updates a program assessment submission for a program participant, if their
 * time has not expired, or updates a program assessment submission by the
 * facilitator, if optional parameter passed is true. If the submission is
 * expired and the function is not passed true for facilitatorOverride, the only
 * update allowed will be to mark a program assessment submission "Expired"
 * instead of "Opened" or "In Progress".
 *
 * @param {AssessmentSubmission} assessmentSubmission - The updated program
 *   assessment submission information, including responses.
 * @param {boolean} [facilitatorOverride] - Optional specifier for when the
 *   program facilitator is the one updating a program assessment submission,
 *   skipping the submission expiration check.
 * @returns {Promise<AssessmentSubmission>} An AssessmentSubmission object
 *   constructed from the updated row in the assessment_submissions table.
 */
export const updateAssessmentSubmission = async (
  assessmentSubmission: AssessmentSubmission,
  facilitatorOverride?: boolean
): Promise<AssessmentSubmission> => {
  const existingAssessmentSubmission = await getAssessmentSubmission(
    assessmentSubmission.id,
    true,
    facilitatorOverride || false
  );

  const updatedSubmission = structuredClone(assessmentSubmission);

  let newState;

  if (facilitatorOverride && facilitatorOverride === true) {
    const updatedResponses: AssessmentResponse[] = [];
    // update each response's score and grading, only if there is a matching existing responses
    for (const assessmentResponse of assessmentSubmission.responses) {
      updatedResponses.push(
        await updateSubmissionResponse(assessmentResponse, true)
      );
    }

    // update submission state and score
    newState = assessmentSubmission.assessment_submission_state;
    const [gradedStateId] = await db('assessment_submission_states')
      .select('id')
      .where('title', newState);
    await db('assessment_submissions')
      .update({
        assessment_submission_state_id: gradedStateId.id,
        score: assessmentSubmission.score,
      })
      .where('id', assessmentSubmission.id);

    updatedSubmission.responses = updatedResponses;
    updatedSubmission.assessment_submission_state = newState;
  } else if (
    ['Expired', 'Submitted', 'Graded'].includes(
      existingAssessmentSubmission.assessment_submission_state
    )
  ) {
    return existingAssessmentSubmission;
  } else if (
    ['Opened', 'In Progress'].includes(
      existingAssessmentSubmission.assessment_submission_state
    )
  ) {
    const assessmentSubmissionNoGrades =
      removeGradingInformation(assessmentSubmission);
    // participant could only update opened and in progress submssion that within due date.
    if (
      assessmentSubmission.assessment_submission_state === 'Expired' ||
      (await assessmentSubmissionExpired(assessmentSubmission))
    ) {
      newState = 'Expired';

      // Override to force frontend to update state
      updatedSubmission.last_modified = DateTime.now()
        .plus({ weeks: 1 })
        .toUTC()
        .toISO();
    } else {
      // participant could only update state to 'Submitted' or 'In Progress', default in progress.
      newState =
        assessmentSubmission.assessment_submission_state === 'Submitted'
          ? 'Submitted'
          : 'In Progress';

      const updatedResponses: AssessmentResponse[] = [];

      // if there is an existing response, update it, otherwise insert new response.
      if (
        assessmentSubmission.responses &&
        Array.isArray(assessmentSubmission.responses) &&
        assessmentSubmission.responses.length > 0
      ) {
        for (const assessmentResponse of assessmentSubmissionNoGrades.responses) {
          const matchingExistingResponses =
            existingAssessmentSubmission.responses?.filter(
              e => e.id === assessmentResponse.id
            );
          if (
            !Array.isArray(existingAssessmentSubmission.responses) ||
            matchingExistingResponses.length === 0
          ) {
            updatedResponses.push(
              await createSubmissionResponse(assessmentResponse)
            );
          } else {
            const [existingResponse] = matchingExistingResponses;

            if (
              (typeof assessmentResponse.answer_id !== 'undefined' &&
                assessmentResponse.answer_id !== null &&
                existingResponse.answer_id !== assessmentResponse.answer_id) ||
              (typeof assessmentResponse.response_text !== 'undefined' &&
                assessmentResponse.response_text !== null &&
                existingResponse.response_text !==
                  assessmentResponse.response_text)
            ) {
              updatedResponses.push(
                await updateSubmissionResponse(assessmentResponse, false)
              );
            } else {
              updatedResponses.push(assessmentResponse);
            }
          }
        }
      }

      updatedSubmission.responses = updatedResponses;
    }

    const [newStateId] = await db('assessment_submission_states')
      .select('id')
      .where('title', newState);
    // If new state is submitted, update with a submission time.
    if (newState === 'Submitted') {
      await db('assessment_submissions')
        .update({
          assessment_submission_state_id: newStateId.id,
          submitted_at: db.fn.now(),
        })
        .where('id', assessmentSubmission.id);
    } else {
      await db('assessment_submissions')
        .update({ assessment_submission_state_id: newStateId.id })
        .where('id', assessmentSubmission.id);
    }

    updatedSubmission.assessment_submission_state = newState;
  }

  return updatedSubmission;
};

/**
 * Updates an existing curriculum assessment, its metadata, and its associated
 * questions and answers if given.
 *
 * @param {CurriculumAssessment} curriculumAssessment - The updated curriculum
 *   assessment information with which to update the corresponding database
 *   data.
 * @returns {Promise<CurriculumAssessment>} The updated CurriculumAssessment
 *   object that was handed to us, if update was successful.
 */
export const updateCurriculumAssessment = async (
  curriculumAssessment: CurriculumAssessment
): Promise<CurriculumAssessment> => {
  const existingCurriculumAssessment = await getCurriculumAssessment(
    curriculumAssessment.id,
    true,
    true
  );

  // Determine which questions are new, updated, or deleted.
  const newQuestions: Question[] = [];
  const updatedQuestions: Question[] = [];

  if (
    curriculumAssessment.questions &&
    Array.isArray(curriculumAssessment.questions) &&
    curriculumAssessment.questions.length > 0
  ) {
    for (const question of curriculumAssessment.questions) {
      if (question.id && question.id !== 0) {
        if (
          existingCurriculumAssessment.questions &&
          Array.isArray(existingCurriculumAssessment.questions) &&
          existingCurriculumAssessment.questions.length > 0
        ) {
          const eqIndex = existingCurriculumAssessment.questions.findIndex(
            existingQuestion => existingQuestion.id === question.id
          );
          existingCurriculumAssessment.questions.splice(eqIndex, 1);
        }
        updatedQuestions.push(question);
      } else {
        newQuestions.push(question);
      }
    }
  }

  if (
    existingCurriculumAssessment.questions &&
    Array.isArray(existingCurriculumAssessment.questions) &&
    existingCurriculumAssessment.questions.length > 0
  ) {
    for (const deletedQuestion of existingCurriculumAssessment.questions) {
      await deleteAssessmentQuestion(deletedQuestion.id);
    }
  }

  const newQuestionList: Question[] = [];

  for (const updatedQuestion of updatedQuestions) {
    newQuestionList.push(await updateAssessmentQuestion(updatedQuestion));
  }

  for (const newQuestion of newQuestions) {
    newQuestionList.push(
      await createAssessmentQuestion(curriculumAssessment.id, newQuestion)
    );
  }

  await db('curriculum_assessments')
    .update({
      title: curriculumAssessment.title,
      description: curriculumAssessment.description,
      max_score: curriculumAssessment.max_score,
      max_num_submissions: curriculumAssessment.max_num_submissions,
      time_limit: curriculumAssessment.time_limit,
      activity_id: curriculumAssessment.activity_id,
    })
    .where('id', curriculumAssessment.id);

  curriculumAssessment.questions = newQuestionList;

  return curriculumAssessment;
};

/**
 * Updates an existing program assessment in the program_assessments table.
 *
 * @param {ProgramAssessment} programAssessment - The updated program assessment
 *   information with which to update the corresponding database data.
 * @returns {Promise<ProgramAssessment>} The updated ProgramAssessment object
 *   that was handed to us, if update was successful.
 */
export const updateProgramAssessment = async (
  programAssessment: ProgramAssessment
): Promise<ProgramAssessment> => {
  await db('program_assessments')
    .update({
      available_after: programAssessment.available_after,
      due_date: programAssessment.due_date,
    })
    .where('id', programAssessment.id);

  return programAssessment;
};
