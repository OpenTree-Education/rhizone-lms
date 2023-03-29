import { mockQuery } from '../mockDb';

import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  facilitatorProgramIdsMatchingCurriculum,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listAllProgramAssessmentSubmissions,
  listAssessmentQuestions,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../assessmentsService';

import {
  assessmentResponsesRowGraded,
  assessmentSubmissionsRowGraded,
  exampleAssessmentSubmissionGraded,
  exampleProgramAssessment,
  exampleProgramAssessmentsRow,
  exampleProgramParticipantRoleFacilitatorRow,
  exampleProgramParticipantRoleParticipantRow,
  facilitatorPrincipalId,
  participantPrincipalId,
  matchingCurriculumAssessmentRows,
  curriculumAssessmentId,
  exampleCurriculumAssessmentWithQuestion,
  matchingAssessmentQuestionsRow,
  matchingAssessmentAnswersRow,
  unenrolledPrincipalId,
  exampleCurriculumAssessment,
  exampleFacilitatorAssessmentSubmissionsSummary,
  unexpectedCurriculumAssessmentId,
  exampleAssessmentQuestions,
  exampleCurriculumAssessmentWithCorrectAnswers,
  exampleParticipantAssessmentSubmissionsSummary,
  updatedProgramAssessmentsRow,
  newProgramAssessment,
  matchingProgramRow,
  exampleAssessmentSubmissionOpened,
  exampleOtherAssessmentSubmissionSubmitted,
  matchingAssessmentSubmissionOpenedRow,
  matchingOtherAssessmentSubmissionSubmittedRow,
} from '../../assets/data';

describe('constructFacilitatorAssessmentSummary', () => {
  it('should gather the relevant information for constructing a FacilitatorAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select count(distinct `principal_id`) as `count` from `assessment_submissions` where `assessment_id` = ?',
      [exampleProgramAssessment.assessment_id],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_participants_with_submissions,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `program_participants` where `program_id` = ? and `role_id` = ?',
      [exampleProgramAssessment.program_id, 2],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_program_participants,
        },
      ]
    );
    mockQuery(
      'select count(`id`) as `count` from `assessment_submissions` where `assessment_id` = ? and `score` is null',
      [exampleProgramAssessment.assessment_id],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_ungraded_submissions,
        },
      ]
    );

    expect(
      await constructFacilitatorAssessmentSummary(
        exampleProgramAssessment.assessment_id,
        exampleProgramAssessment.program_id
      )
    ).toEqual(exampleFacilitatorAssessmentSubmissionsSummary);
  });
});

describe('constructParticipantAssessmentSummary', () => {
  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.assessment_id, 1],
      [{ title: exampleParticipantAssessmentSubmissionsSummary.highest_state }]
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.assessment_id, 1],
      [
        {
          submitted_at:
            exampleParticipantAssessmentSubmissionsSummary.most_recent_submitted_date,
        },
      ]
    );
    mockQuery(
      'select `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ? and `principal_id` = ?',
      [exampleProgramAssessment.assessment_id, participantPrincipalId],
      [assessmentSubmissionsRowGraded]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.assessment_id, 1],
      [{ score: exampleParticipantAssessmentSubmissionsSummary.highest_score }]
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessment.assessment_id
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsSummary);
  });
});

describe('createAssessmentSubmission', () => {});

describe('createCurriculumAssessment', () => {});

describe('createProgramAssessment', () => {
  it('should create a program assessment ID', async () => {
    mockQuery(
      'insert into `program_assessments` (`assessment_id`, `available_after`, `due_date`, `program_id`) values (?, ?, ?, ?)',
      [
        newProgramAssessment.assessment_id,
        newProgramAssessment.available_after,
        newProgramAssessment.due_date,
        newProgramAssessment.program_id,
      ],
      [updatedProgramAssessmentsRow.id]
    );

    expect(await createProgramAssessment(newProgramAssessment)).toEqual(
      updatedProgramAssessmentsRow
    );
  });
});

describe('deleteCurriculumAssessment', () => {});

describe('deleteProgramAssessment', () => {});

describe('facilitatorProgramIdsMatchingCurriculum', () => {
  it('should return an array of program IDs for a principal that is facilitator of at least one program', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [facilitatorPrincipalId],
      [{ program_id: exampleProgramAssessment.program_id }]
    );
    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `curriculum_id` = ?',
      [exampleCurriculumAssessment.curriculum_id],
      [matchingProgramRow]
    );
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, exampleProgramAssessment.program_id],
      [{ title: 'Facilitator' }]
    );

    expect(
      await facilitatorProgramIdsMatchingCurriculum(
        facilitatorPrincipalId,
        exampleCurriculumAssessment.curriculum_id
      )
    ).toEqual([exampleProgramAssessment.program_id]);
  });

  it('should return an empty array of program IDs for a principal that is not a facilitator of at least one program', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [participantPrincipalId],
      []
    );
    expect(
      await facilitatorProgramIdsMatchingCurriculum(
        participantPrincipalId,
        exampleCurriculumAssessment.curriculum_id
      )
    ).toEqual([]);
  });
});

describe('findProgramAssessment', () => {
  it('should return a ProgramAssessment for an existing program assessment ID', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      [exampleProgramAssessmentsRow]
    );

    expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
      exampleProgramAssessment
    );
  });

  it('should return null for a program assessment ID that does not exist', async () => {
    mockQuery(
      'select `program_id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `id` = ?',
      [exampleProgramAssessment.id],
      []
    );

    expect(await findProgramAssessment(exampleProgramAssessment.id)).toEqual(
      null
    );
  });
});

describe('getAssessmentSubmission', () => {
  it('should get assessment submission based on given submission ID', async () => {
    const assessmentSubmissionId = exampleAssessmentSubmissionGraded.id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_id`, `principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [assessmentSubmissionsRowGraded]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [assessmentResponsesRowGraded]
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(exampleAssessmentSubmissionGraded);
  });

  it('should return null for a assessment submission ID that does not exist', async () => {
    mockQuery(
      'select `assessment_id`, `principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [exampleAssessmentSubmissionGraded.id],
      []
    );

    expect(
      await getAssessmentSubmission(
        exampleAssessmentSubmissionGraded.id,
        true,
        true
      )
    ).toEqual(null);
  });
});

describe('getCurriculumAssessment', () => {
  it('should return a CurriculumAssessment for an existing curriculum assessment ID', async () => {
    const questionsAndAllAnswersIncluded = true,
      questionsAndCorrectAnswersIncluded = true;

    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [exampleCurriculumAssessmentWithCorrectAnswers.id],
      [matchingCurriculumAssessmentRows]
    );
    mockQuery(
      'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
      [matchingCurriculumAssessmentRows.activity_id],
      [{ title: exampleCurriculumAssessmentWithCorrectAnswers.assessment_type }]
    );
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ?',
      [exampleCurriculumAssessmentWithCorrectAnswers.id],
      [matchingAssessmentQuestionsRow]
    );

    const questionIds = [matchingAssessmentQuestionsRow.id];

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ?',
      [questionIds[0]],
      [matchingAssessmentAnswersRow]
    );

    expect(
      await getCurriculumAssessment(
        exampleCurriculumAssessmentWithCorrectAnswers.id,
        questionsAndAllAnswersIncluded,
        questionsAndCorrectAnswersIncluded
      )
    ).toEqual(exampleCurriculumAssessmentWithCorrectAnswers);
  });

  it('should return null for a curriculum assessment ID that does not exist', async () => {
    mockQuery(
      'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
      [curriculumAssessmentId],
      []
    );

    expect(
      await getCurriculumAssessment(curriculumAssessmentId, true, true)
    ).toEqual(null);
  });
});

describe('getPrincipalProgramRole', () => {
  it('should return the correct role for a facilitator based on principal ID and program ID', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, exampleProgramAssessment.program_id],
      [exampleProgramParticipantRoleFacilitatorRow]
    );

    expect(
      await getPrincipalProgramRole(
        facilitatorPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual('Facilitator');
  });

  it('should return the correct role for a participant based on principal ID and program ID', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.program_id],
      [exampleProgramParticipantRoleParticipantRow]
    );

    expect(
      await getPrincipalProgramRole(
        participantPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual('Participant');
  });

  it('should return null for a user not enrolled in the program', async () => {
    mockQuery(
      'select `program_participant_roles`.`title` from `program_participants` inner join `program_participant_roles` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [unenrolledPrincipalId, exampleProgramAssessment.program_id],
      []
    );

    expect(
      await getPrincipalProgramRole(
        unenrolledPrincipalId,
        exampleProgramAssessment.program_id
      )
    ).toEqual(null);
  });
});

describe('listAssessmentQuestions', () => {
  it('should return all questions of a given curriculum assessment based on specified boolean parameter', async () => {
    const answersIncluded = true;
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ?',
      [exampleCurriculumAssessment.id],
      [matchingAssessmentQuestionsRow]
    );

    const questionIds = [matchingAssessmentQuestionsRow.id];

    mockQuery(
      'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ?',
      [questionIds[0]],
      [matchingAssessmentAnswersRow]
    );

    expect(
      await listAssessmentQuestions(
        exampleCurriculumAssessment.id,
        answersIncluded
      )
    ).toEqual(exampleAssessmentQuestions);
  });
});

describe('listAllProgramAssessmentSubmissions', () => {
  it('should return all program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `principal_id`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id],
      [
        matchingAssessmentSubmissionOpenedRow,
        matchingOtherAssessmentSubmissionSubmittedRow,
      ]
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual([
      exampleAssessmentSubmissionOpened,
      exampleOtherAssessmentSubmissionSubmitted,
    ]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `principal_id`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id],
      []
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual(null);
  });
});

describe('listParticipantProgramAssessmentSubmissions', () => {
  it('should return program assessment submissions for a participant for a given program assessment', async () => {
    mockQuery(
      'select `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ? and `principal_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id, participantPrincipalId],
      [matchingAssessmentSubmissionOpenedRow]
    );
    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual([exampleAssessmentSubmissionOpened]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `score`, `opened_at`, `submitted_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ? and `principal_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id, participantPrincipalId],
      []
    );

    expect(
      await listParticipantProgramAssessmentSubmissions(
        participantPrincipalId,
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual(null);
  });
});

describe('listPrincipalEnrolledProgramIds', () => {});

describe('listProgramAssessments', () => {});

describe('updateAssessmentSubmission', () => {});

describe('updateCurriculumAssessment', () => {});

describe('updateProgramAssessment', () => {
  it('should return update for an existing program assessment ID', async () => {
    mockQuery(
      'update `program_assessments` set `available_after` = ?, `due_date` = ? where `id` = ?',
      [
        updatedProgramAssessmentsRow.available_after,
        updatedProgramAssessmentsRow.due_date,
        updatedProgramAssessmentsRow.id,
      ],
      []
    );

    expect(await updateProgramAssessment(updatedProgramAssessmentsRow)).toEqual(
      updatedProgramAssessmentsRow
    );
  });
});
