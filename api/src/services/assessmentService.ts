import db from './db';

import {
  Answer,
  AssessmentResponse,
  AssessmentSubmission,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  CurriculumAssessment,
  ProgramAssessment,
  Question,
  AssessmentWithSummary,
} from '../models';

/**
 * a function that returns assessment summary that needed for getAssessmentsSummary function
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @returns {AssessmentWithSummary} - assessment summary that includes curiculum assessment, program assessment and submissions summury based on facilitator and participant roles
 *
 */
export const getAssessmentSubmissionsSummary = async (
  principalId: number
): Promise<AssessmentWithSummary[]> => {
  const enrolledProgramIds = await principalEnrolledPrograms(principalId);

  const assessmentsSummaryList: AssessmentWithSummary[] = [];

  for (const enrolledProgramId of enrolledProgramIds) {
    const roleInProgram = await findRoleInProgram(
      principalId,
      enrolledProgramId
    );
    const programAssessments = await getAssessmentsForProgram(
      enrolledProgramId
    );

    for (const programAssessment of programAssessments) {
      if (roleInProgram === 'Participant') {
        assessmentsSummaryList.push({
          curriculum_assessment: await getCurriculumAssessmentById(
            programAssessment.assessment_id,
            false,
            false
          ),
          program_assessment: programAssessment,
          participant_submissions_summary:
            await getParticipantAssessmentSubmissionsSummary(
              programAssessment.assessment_id,
              principalId
            ),
          principal_program_role: roleInProgram,
        });
      }

      if (roleInProgram === 'Facilitator') {
        assessmentsSummaryList.push({
          curriculum_assessment: await getCurriculumAssessmentById(
            programAssessment.assessment_id,
            false,
            false
          ),
          program_assessment: programAssessment,
          facilitator_submissions_summary:
            await getFacilitatorAssessmentSubmissionsSummary(
              programAssessment.assessment_id
            ),
          principal_program_role: roleInProgram,
        });
      }
    }
  }
  return assessmentsSummaryList;
};
//???? Do we use this function ?
/**
 * a function that returns program ID base on given assessment ID
 * @param {number} curriculumAssessmentId - The ID that associated with assessment ID in program assessment
 * @returns {programId} - The program ID
 *
 */
export const getProgramIdByProgramAssessmentId = async (
  assessmentId: number
): Promise<number> => {
  const [programId] = await db<number>('program_assessment')
    .select('program_id')
    .where('assessment_id', assessmentId);
  return programId as number;
};

/**
 * a function that returns list of program IDs based on given principalId
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @returns {enrolledProgramsList} -The list of program IDs
 *
 */
export const principalEnrolledPrograms = async (principalId: number) => {
  const enrolledProgramsList = await db('program_participants')
    .select('program_id')
    .where({ principal_id: principalId });
  return enrolledProgramsList;
  // .map(
  //   enrolledProgram => enrolledProgram.program_id //???? why we should map
  // );
};

/**
 * A function that returns program assessments based on a given program ID.
 * @param {number} programId - The ID of the program for which to fetch assessments.
 * @returns {Promise<ProgramAssessment[]>} - An array of program assessments associated with the program ID.
 *
 */
export const getAssessmentsForProgram = async (
  programId: number
): Promise<ProgramAssessment[]> => {
  const matchingProgramAssessment = await db<ProgramAssessment>(
    'program_assessments'
  )
    .select('*')
    .where({ program_id: programId });
  return matchingProgramAssessment;
};

//???? Do we use this function ?
/**
 *
 * A function that retrieves details about a curriculum assessment for a given assessment ID.
 * @param {number} assessmentId - The ID of the assessment to retrieve.
 * @param {boolean} [includeQuestions=false] - Whether to include the questions associated with the assessment.
 * @param {boolean} [includeAnswers=false] - Whether to include the answers associated with the questions.
 * @returns {Promise<CurriculumAssessment>} - The details about the curriculum assessment.
 *
 */
export const getCurriculumAssessment = async (
  assessmentId: number,
  includeQuestions?: boolean,
  includeAnswers?: boolean
): Promise<CurriculumAssessment> => {
  const [curriculumAssessmentDetails] = await db<CurriculumAssessment>(
    'curriculum_assessments'
  ).select(
    'id',
    'title',
    'assessment_type',
    'max_score',
    'max_num_submissions',
    'time_limit',
    'curriculum_id',
    'activity_id',
    'principal_id',
    'created_at',
    'updated_at'
  );

  if (includeQuestions === true) {
    curriculumAssessmentDetails.questions =
      await getQuestionsByCurriculumAssessmentId(assessmentId, includeAnswers);
  }
  return curriculumAssessmentDetails;
};

/**
 * a function that returns FacilitatorAssessmentSubmissionsSummary based on given assessmentId and ProgramId.
 * @param {number} programAssessmentId - The submission ID for the specified assesment
 * @returns {FacilitatorAssessmentSubmissionsSummary} - assessment summary for qty of participants with submissions, total number of participants in program, number of submissions that are submitted but not yet graded
 *
 */
export const getFacilitatorAssessmentSubmissionsSummary = async (
  programAssessmentId: number
): Promise<FacilitatorAssessmentSubmissionsSummary> => {
  const numParticipantsWithSubmissions = await getTotalNumSubmissons(
    programAssessmentId
  );
  const numProgramParticipants = await getNumProgramParticipants(
    programAssessmentId
  );
  const numUngradedSubmissions = await getNumUngradedSubmissons(
    programAssessmentId
  );

  return {
    num_participants_with_submissions: numParticipantsWithSubmissions,
    num_program_participants: numProgramParticipants,
    num_ungraded_submissions: numUngradedSubmissions,
  };
};

// *******  Helpers for FacilitatorAssessmentSubmissionsSummary  **************//

/**
 *
 * A function that returns the number of program participants for a given program assessment ID.
 * @param {number} programAssessmentId - The program assessment ID for the specified program.
 * @returns {number} - The number of program participants for the given program assessment ID.
 *
 */
export const getNumProgramParticipants = async (
  programAssessmentId: number
): Promise<number> => {
  const [numProgramParticipants] = await db<number>('program_assessments')
    .where('id', programAssessmentId)
    .andWhere('role_id', 1)
    .count({ count: 'program_id' });
  return numProgramParticipants as number;
};

/**
 *
 * A function that returns the number of ungraded submissions for a given program assessment ID.
 * @param {number} programAssessmentId - The program assessment ID for the specified assessment.
 * @returns {Promise<number>} - The number of ungraded submissions.
 *
 */
export const getNumUngradedSubmissons = async (
  programAssessmentId: number
): Promise<number> => {
  const [numUngradedSubmissions] = await db<number>('assessment_submissions')
    .where('assessment_id', programAssessmentId)
    .andWhere('score', null)
    .count({ count: '*' });
  return numUngradedSubmissions as number;
};

/**
 *
 * a function that returns the total number of submissions for a given program assessment ID
 * @param {number} programAssessmentId - The program assessment ID for the specified assessment
 * @returns {number} - The total number of submissions for the given assessment ID
 *
 */
export const getTotalNumSubmissons = async (
  programAssessmentId: number
): Promise<number> => {
  const [numTotalSubmissions] = await db<number>('assessment_submissions')
    .where('assessment_id', programAssessmentId)
    .count({ count: '*' });
  return numTotalSubmissions as number;
};
// *******   end of helpers for FacilitatorAssessmentSubmissionsSummary **************//

/**
 *
 * A function that returns ParticipantAssessmentSubmissionsSummary based on the given program assessment ID and principal ID.
 * @param {number} programAssessmentId - The program assessment ID for the specified program assessment.
 * @param {number} principalId - The principal ID for the specified participant.
 * @returns {Promise<ParticipantAssessmentSubmissionsSummary>} - The summary of the participant's assessment submissions including their highest state, most recent submitted date, total number of submissions, and highest score.
 *
 */
export const getParticipantAssessmentSubmissionsSummary = async (
  ProgramAssessmentId: number,
  principalId: number
): Promise<ParticipantAssessmentSubmissionsSummary> => {
  const [highestState] = await db<string>('assessment_submission')
    .select('assessment_submission_states_title')
    .join(
      'assessment_submission_states_title',
      'assessment_submission_states_title.id',
      'assessment_submission_states_title_id'
    )
    .where('principal_id', principalId)
    .orderBy('assessment_submission_states_title', 'desc');
  if (!highestState) {
    return null;
  }

  const [mostRecentSubmittedDate] = await db<string>('assessment_submissions')
    .select('id', 'submitted_at')
    .where('principal_id', principalId)
    .orderBy('submitted_at', 'desc')
    .limit(1);
  const [totalNumSubmissions] = await db<number>('assessment_submissions')
    .count('id')
    .where('principal_id', principalId);
  const [highestScore] = await db<number>('assessment_submissions')
    .count('id')
    .where('principal_id', principalId)
    .andWhere('assesment_id', ProgramAssessmentId);

  return {
    principal_id: principalId,
    highest_state: String(highestState),
    most_recent_submitted_date: String(mostRecentSubmittedDate),
    total_num_submissions: Number(totalNumSubmissions),
    highest_score: Number(highestScore),
  };
};

/**
 * a function to returns the role of the participant in a given program
 *
 * @param {number} principalId - The restrict result to programs with which the user is associated
 * @param {number} programId - The program ID for the specified program
 *
 */
export const findRoleInProgram = async (
  principalId: number,
  programId: number
) => {
  const [roleName] = await db('program_participants')
    .select('program_participant_roles.title')
    .join(
      'program_participant_roles',
      'program_participant_roles.id',
      'program_participants.role_id'
    )
    .where({ principal_id: principalId, program_id: programId });
  return roleName.title ?? null;
};

//???? Do we use this function ?
/**
 * Returns the curriculum assessment based on the role of the principal.
 * @param {number} principalId - The ID of the principal
 * @param {number} assessmentId - The ID of the assessment
 * @param {number} submissionId - The ID of the submission
 * @returns {Promise<object>} - The assessment and submission details.
 */
export const getCurriculumAssessmentBasedOnRole = async (
  principalId: number,
  assessmentId: number,
  submissionId: number
) => {
  const role = await db('program_participants')
    .select('role_id')
    .where({ principal_id: principalId });

  console.log('role', role[0].role_id);
  if (role[0].role_id === 1) {
    const res = await getCurriculumAssessmentById(assessmentId, true, false);

    const res2 = await submissionDetails(assessmentId, submissionId, true);
    const summary = { res: [res], res2: [res2] };

    return summary;
  } else {
    return getCurriculumAssessmentById(assessmentId, true, false);
  }
};

/**
 * a function to returns details about the curriculum assessment given a curriculum assessment ID, with an optional flag to determine whether or not questions and answers should be included in the return value.
 *
 * @param {number} assessmentId - The curriculum assessment ID
 * @param {boolean} isQuestionsIncluded - The flag if the question should also be sent
 * @param {boolean} isAnswersIncluded - The flag if the answers should also be sent
 * @returns {CurriculumAssessment} - The details about matching curriculum assessment
 */
export const getCurriculumAssessmentById = async (
  assessmentId: number,
  questionsAndAllAnswersIncluded?: boolean,
  questionsAndCorrectAnswersIncluded?: boolean
): Promise<CurriculumAssessment> => {
  const [curriculumAssessmentDetails] = await db<CurriculumAssessment>(
    'curriculum_assessments'
  )
    .select('*')
    .where('id', assessmentId);

  if (questionsAndAllAnswersIncluded == true) {
    const questions = await getQuestionsByCurriculumAssessmentId(
      assessmentId,
      questionsAndCorrectAnswersIncluded
    );

    curriculumAssessmentDetails.questions = questions.filter(
      question => question.assessment_id === curriculumAssessmentDetails.id
    );
  }
  return curriculumAssessmentDetails;
};

/**
 * Retrieves an array of questions for a given curriculum assessment ID, with the option to include or exclude answer data.
 *
 * @param {number} assessmentId - The ID of the curriculum assessment to retrieve questions for.
 * @param {boolean} includeCorrectAnswers - Whether or not to include correct answer data in the returned questions.
 * @returns {Promise<Question[]>} - An array of Question objects for the specified assessment ID.
 */
export const getQuestionsByCurriculumAssessmentId = async (
  assessmentId: number,
  includeCorrectAnswers: boolean
): Promise<Question[]> => {
  const questions = await db<Question>('assessment_questions')
    .select('*')
    .where({ assessment_id: assessmentId });
  console.log('questions', questions);
  if (includeCorrectAnswers === true) {
    const questionIds = questions.map(element => element.id);
    const answers = await db<Answer>('assessment_answers')
      .select('*')
      .whereIn('question_id', questionIds);

    questions.forEach(
      question =>
        (question.answers = answers.filter(
          answer => answer.question_id === question.id
        ))
    );
  }

  return questions;
};

/**
 * a function that returns details about a program assessment given a program assessment ID
 *
 * @param {number} programAssessmentId - The assessment ID for the specified program assessment
 *
 */
export const programAssessmentById = async (
  programAssessmentId: number
): Promise<ProgramAssessment> => {
  const [findProgramAssessmentById] = await db<ProgramAssessment>(
    'program_assessments'
  )
    .select(
      'id',
      'program_id',
      'assessment_id',
      'available_after',
      'due_date',
      'created_at',
      'updated_at'
    )
    .where({ id: programAssessmentId });
  return findProgramAssessmentById;
};

/**
 * A function to return details about your own submissions or all participants' submissions,
 * with an optional flag to determine whether or not responses should be included in the return value.
 *
 * @param {number} programAssessmentId - The assessment ID for the specified assessment
 * @param {boolean} isResponsesIncluded - A flag to determine whether or not responses should be included
 * @returns {<AssessmentSubmission[]>} - A list of assessment submissions in the db
 */
export const submissionDetails = async (
  assessmentId: number,
  submissionId: number,
  isResponsesIncluded: boolean
): Promise<AssessmentSubmission[]> => {
  const assessmentSubmissionByProgramAssessmentId = await db(
    'assessment_submissions'
  )
    .select('id')
    .where({ assessment_id: assessmentId });

  if (isResponsesIncluded) {
    const assessmentSubmissionIds =
      assessmentSubmissionByProgramAssessmentId.map(element => element.id);
    const responses = await db<AssessmentResponse>('assessment_responses')
      .select('*')
      .where({ submission_id: submissionId });

    assessmentSubmissionByProgramAssessmentId.forEach(
      assessment =>
        (assessment.responses = responses.filter(
          response => response.submission_id === assessment.id
        ))
    );
  }
  return assessmentSubmissionByProgramAssessmentId;
};

/**
 *
 * @param {number} principalId - restrict result to programs with which the user is associated
 * @returns {CurriculumAssessment}
 */

export const listAssessmentsByParticipant = async (principalId: number) => {
  const assessmentsList = await db<CurriculumAssessment>(
    'curriculum_assessments'
  )
    .select(
      'id',
      'title',
      'max_score',
      'max_num_submissions',
      'time_limit',
      'curriculum_id',
      'activity_id',
      'principal_id',
      'created_at',
      'updated_at'
    )
    .where('principal_id', principalId);
  return assessmentsList;
};

/**
 * A function that creates a new assessment and associates it with a program
 *
 * @param {string} title - The title of the assessment
 * @param {string} assessmentType - The type of assessment (e.g. "quiz", "exam")
 * @param {string} description - The description of the assessment
 * @param {number} maxScore - The maximum score of the assessment
 * @param {number} maxNumSubmissions - The maximum number of allowed submissions
 * @param {number} timeLimit - The time limit of the assessment (in minutes)
 * @param {number} curriculumId - The ID of the associated curriculum
 * @param {number} activityId - The ID of the associated activity
 * @param {number} principalId - The ID of the principal associated with the program
 * @param {number} programId - The ID of the associated program
 * @param {string} availableAfter - The date and time when the assessment becomes available to participants
 * @param {string} dueDate - The date and time when the assessment is due
 *
 * @returns {{ id: number }} - The ID of the created assessment
 */
export const createAssessment = async (
  title: string,
  assessmentType: string,
  description: string,
  maxScore: number,
  maxNumSubmissions: number,
  timeLimit: number,
  curriculumId: number,
  activityId: number,
  principalId: number,
  programId: number,
  availableAfter: string,
  dueDate: string
): Promise<{ id: number }> => {
  let assessmentId: number;
  await db.transaction(async trx => {
    [assessmentId] = await trx('curriculum_assessments').insert({
      title: title,
      assessment_type: assessmentType,
      description: description,
      max_score: maxScore,
      max_num_submissions: maxNumSubmissions,
      time_limit: timeLimit,
      curriculum_id: curriculumId,
      activity_id: activityId,
      principal_id: principalId,
    });
    await trx('program_assessments').insert({
      assessment_id: assessmentId,
      program_id: programId,
      available_after: availableAfter,
      due_date: dueDate,
    });
  });
  return { id: assessmentId };
};

/**
 * Deletes an assessment from the system with the specified ID.
 *
 * @param {number} assessmentId - The ID of the assessment to delete.
 * @returns {Promise<number>} - The number of rows deleted from the database.
 * @throws {Error} - Throws an error if there was a problem deleting the assessment.
 *
 */
export const deleteAssessmentById = async (assessmentId: number) => {
  return await db.transaction(async trx => {
    return await trx('curriculum_assessments')
      .where({ id: assessmentId })
      .del();
  });
};

/**
 * Updates an assessment by ID
 *
 * @param {string} title - The title for the assessment
 * @param {string} description - The description for the assessment
 * @param {number} maxScore - The maximum score for the assessment
 * @param {number} maxNumSubmissions - The maximum number of allowed submissions for the assessment
 * @param {number} timeLimit - The time limit for the assessment
 * @param {number} curriculumId - The ID for the unique curriculum assessment
 * @param {number} principalId - Restricts the result to programs with which the user is associated
 * @param {number} activityId - The number of activity in the database
 * @param {Array<Question>} questions - The array of questions for the assessment
 * @param {string} availableAfter - The date after which the assessment will be available
 * @param {string} dueDate - The date by which the assessment is due
 * @param {number} programId - The program ID for the specified program
 * @param {number} assessmentId - The assessment ID for the specified assessment
 * @returns {Promise<{assessment_id: number}>} - The updated assessment ID
 *
 */

export const updateAssessmentById = async (
  title: string,
  assessmentType: string,
  description: string,
  maxScore: number,
  maxNumSubmissions: number,
  timeLimit: number,
  curiculumId: number,
  principalId: number,
  activityId: number,
  questions: [],
  availableAfter: string,
  dueDate: string,
  programId: number,
  assessmentId: number
): Promise<{ assessment_id: number }> => {
  await db('curriculum_assessments').where({ id: assessmentId }).update({
    title,
    assessmentType,
    description,
    maxScore,
    maxNumSubmissions,
    timeLimit,
    curiculumId,
    activityId,
    principalId,
  });
  await db('program_assessments')
    .where({ curiculum_id: curiculumId })
    .update({ availableAfter, dueDate, programId });
  await db('assessment_questions')
    .where({ assessment_id: assessmentId })
    .update({ title: questions, description: description });
  return { assessment_id: assessmentId };
};

/**
 * A function that finds an assessment in the system by ID
 *
 * @param {number} assessmentId - The ID of the assessment to find
 * @returns {Promise<CurriculumAssessment>} The matching assessment
 *
 * */
export const findAssessment = async (assessmentId: number) => {
  const [matchingAssessment] = await db<CurriculumAssessment>(
    'curriculum_assessment'
  )
    .select(
      'id',
      'title',
      'start_date',
      'end_date',
      'time_zone',
      'curriculum_id'
    )
    .where({ id: assessmentId });
  return matchingAssessment;
};

//????do we use this function
/**
 * Get information about assessment submission based on role
 *
 * @param {number} assessmentId - The ID of the assessment for the specified submission
 * @param {number} programId - The ID of the program for the specified submission
 * @param {number} principalId - The ID of the principal for the specified submission
 * @returns {Promise<AssessmentSubmission>} - An object representing the assessment submission
 */
export const findSubmissionByAssessmentId = async (
  assessmentId: number,
  programId: number,
  principalId: number
): Promise<AssessmentSubmission> => {
  const role = await findRoleInProgram(programId, principalId);

  const [matchingAssessmentForFacilitator] = await db<AssessmentSubmission>(
    'assessment_submissions'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });
  const [matchingAssessmentForParticipant] = await db<AssessmentSubmission>(
    'assessment_submissions'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });

  return role === 'Facilitator'
    ? matchingAssessmentForFacilitator
    : matchingAssessmentForParticipant;
};

/**
 * Retrieves a list of all submissions for a given assessment ID
 * @param {number} assessmentId - The ID of the assessment to retrieve submissions for
 * @returns {Promise<AssessmentSubmission[]>} - A list of all submissions for the given assessment ID
 */
export const listSubmissions = async (assessmentId: number) => {
  const [matchingAssessment] = await db<AssessmentSubmission>(
    'curriculum_assessment'
  )
    .select(
      'assessment_id',
      'principal_id',
      'assessment_submisson_state_id',
      'score',
      'opened_at',
      'submitted_at',
      'created_at',
      'updated_at'
    )
    .where({ assessment_id: assessmentId });
  return matchingAssessment;
};
