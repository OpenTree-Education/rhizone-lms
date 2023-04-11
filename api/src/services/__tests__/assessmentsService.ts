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
  removeGradingInformation,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../assessmentsService';

import {
  exampleAssessmentSubmissionGraded,
  exampleProgramAssessment,
  facilitatorPrincipalId,
  participantPrincipalId,
  curriculumAssessmentId,
  matchingAssessmentQuestionsRow,
  matchingProgramRow,
  unenrolledPrincipalId,
  exampleCurriculumAssessment,
  exampleFacilitatorAssessmentSubmissionsSummary,
  exampleCurriculumAssessmentWithCorrectAnswers,
  exampleParticipantAssessmentSubmissionsSummary,
  updatedProgramAssessmentsRow,
  exampleAssessmentSubmissionOpened,
  exampleOtherAssessmentSubmissionSubmitted,
  matchingAssessmentSubmissionOpenedRow,
  matchingOtherAssessmentSubmissionSubmittedRow,
  exampleParticipantAssessmentSubmissionsInactive,
  exampleProgramAssessmentNotAvailable,
  exampleParticipantAssessmentSubmissionsPastDue,
  exampleParticipantAssessmentSubmissionsActive,
  exampleAssessmentSubmissionGradedNoResponses,
  matchingProgramAssessmentsRow,
  exampleAssessmentSubmissionGradedRemovedGrades,
  matchingAssessmentResponsesRowSCGraded,
  matchingProgramParticipantRoleParticipantRow,
  matchingProgramParticipantRoleFacilitatorRow,
  matchingAssessmentResponsesRowFRGraded,
  matchingAssessmentSubmissionsRowGraded,
  sentNewProgramAssessment,
  exampleProgramAssessmentPastDue,
  matchingProgramAssessmentNotAvailableRow,
  programAssessmentId,
  updatedAssessmentResponsesSCGradedRow,
  sentUpdatedAssessmentSubmissionSCResponseSubmitted,
  sentUpdatedAssessmentSubmissionSCResponseGraded,
  newProgramAssessmentsRow,
  exampleAssessmentSubmissionSubmitted,
  matchingAssessmentAnswersSCRow,
  exampleAssessmentQuestionsWithoutCorrectAnswers,
  exampleAssessmentQuestionsWithCorrectAnswers,
  exampleCurriculumAssessmentWithQuestions,
  sentUpdatedCurriculumAssessment,
  singleChoiceAnswerId,
  singleChoiceQuestionId,
  exampleCurriculumAssessmentWithQuestionsNewAnswers,
  exampleAssessmentQuestionsWithNewAnswers,
  matchingCurriculumAssessmentRow,
  sentNewCurriculumAssessment,
  sentUpdatedAssessmentSubmissionChangedResponse,
  updatedAssessmentSubmissionsRow,
  assessmentSubmissionId,
  facilitatorProgramIdsThatMatchCurriculum,
} from '../../assets/data';

describe('constructFacilitatorAssessmentSummary', () => {
  it('should gather the relevant information for constructing a FacilitatorAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select count(distinct `principal_id`) as `count` from `assessment_submissions` where `assessment_id` = ?',
      [exampleProgramAssessment.id],
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
      [exampleProgramAssessment.id],
      [
        {
          count:
            exampleFacilitatorAssessmentSubmissionsSummary.num_ungraded_submissions,
        },
      ]
    );

    expect(
      await constructFacilitatorAssessmentSummary(exampleProgramAssessment)
    ).toEqual(exampleFacilitatorAssessmentSubmissionsSummary);
  });
});

describe('constructParticipantAssessmentSummary', () => {
  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [
        {
          title:
            matchingAssessmentSubmissionsRowGraded.assessment_submission_state,
        },
      ]
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [
        {
          submitted_at: matchingAssessmentSubmissionsRowGraded.submitted_at,
        },
      ]
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      [matchingAssessmentSubmissionsRowGraded]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      [{ score: matchingAssessmentSubmissionsRowGraded.score }]
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessment
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsSummary);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, before assessment is active', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessmentNotAvailable
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsInactive);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, for an active assessment', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      []
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessment
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsActive);
  });

  it('should gather the relevant information for constructing a ParticipantAssessmentSubmissionsSummary even if no submissions, after assessment is due', async () => {
    mockQuery(
      'select `assessment_submission_states`.`title` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submission_states`.`id` = `assessment_submissions`.`assessment_submission_state_id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ? order by `assessment_submissions`.`assessment_submission_state_id` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `submitted_at` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `submitted_at` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );
    mockQuery(
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.id],
      [1]
    );
    mockQuery(
      'select `score` from `assessment_submissions` where `principal_id` = ? and `assessment_id` = ? order by `score` desc limit ?',
      [participantPrincipalId, exampleProgramAssessment.id, 1],
      []
    );

    expect(
      await constructParticipantAssessmentSummary(
        participantPrincipalId,
        exampleProgramAssessmentPastDue
      )
    ).toEqual(exampleParticipantAssessmentSubmissionsPastDue);
  });
});

// describe('createAssessmentSubmission', () => {
//   it('should create a new AssessmentSubmission for a program assessment', async () => {
//     const openedSubmission = {
//       ...exampleAssessmentSubmissionOpened,
//       opened_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
//     };

//     mockQuery(
//       'select `id` from `assessment_submission_states` where `title` = ?',
//       ['Opened'],
//       [3]
//     );
//     mockQuery(
//       'insert into `assessment_submissions` (`assessment_id`, `assessment_submission_state_id`, `principal_id`) values (?, DEFAULT, ?)',
//       [exampleAssessmentSubmissionOpened.assessment_id, participantPrincipalId],
//       [exampleAssessmentSubmissionOpened.id]
//     );
//     // mockQuery('select `id` from `assessment_questions` where `assessment_id` = ?',
//     // [exampleAssessmentSubmissionOpened.assessment_id],[])

//     expect(
//       await createAssessmentSubmission(
//         participantPrincipalId,
//         exampleAssessmentSubmissionOpened.assessment_id,
//         exampleProgramAssessment.assessment_id
//         // exampleProgramAssessment.id
//       )
//     ).toEqual(openedSubmission);
//   });
// });

describe('createCurriculumAssessment', () => {
  // it('should create a curriculum assessment ID without question', async () => {
  //   mockQuery(
  //     'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
  //     [
  //       sentNewCurriculumAssessment.activity_id,
  //       sentNewCurriculumAssessment.curriculum_id,
  //       sentNewCurriculumAssessment.description,
  //       sentNewCurriculumAssessment.max_num_submissions,
  //       sentNewCurriculumAssessment.max_score,
  //       sentNewCurriculumAssessment.principal_id,
  //       sentNewCurriculumAssessment.time_limit,
  //       sentNewCurriculumAssessment.title,
  //     ],
  //     [updatedCurriculumAssessment.id]
  //   );
  //   expect(await createCurriculumAssessment(newCurriculumAssessment)).toEqual(
  //     updatedCurriculumAssessment
  //   );
  // });
  // it('should create a curriculum assessment ID with a single choice question', async () => {
  //   mockQuery(
  //     'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
  //     [
  //       newCurriculumAssessmentWithSingleChoiceQuestion.activity_id,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.curriculum_id,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.description,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.max_num_submissions,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.max_score,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.principal_id,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.time_limit,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.title,
  //     ],
  //     [updatedCurriculumAssessment.id]
  //   );
  //   mockQuery(
  //     'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
  //     [
  //       updatedCurriculumAssessment.id,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0]
  //         .description,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].max_score,
  //       1,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].sort_order,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].title,
  //     ],
  //     [updatedSingleChoiceQuestion.id]
  //   );
  //   mockQuery(
  //     'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
  //     [
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].answers[0]
  //         .description,
  //       updatedSingleChoiceQuestion.id,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].answers[0]
  //         .sort_order,
  //       newCurriculumAssessmentWithSingleChoiceQuestion.questions[0].answers[0]
  //         .title,
  //     ],
  //     [updatedSingleChoiceAnswer.id]
  //   );
  //   mockQuery(
  //     'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
  //     [updatedSingleChoiceAnswer.id, updatedSingleChoiceQuestion.id],
  //     []
  //   );
  //   expect(
  //     await createCurriculumAssessment(
  //       newCurriculumAssessmentWithSingleChoiceQuestion
  //     )
  //   ).toEqual(updatedCurriculumAssessmentWithSingleChoiceQuestion);
  // });
  // it('should create a curriculum assessment ID with a free response question', async () => {
  //   mockQuery(
  //     'insert into `curriculum_assessments` (`activity_id`, `curriculum_id`, `description`, `max_num_submissions`, `max_score`, `principal_id`, `time_limit`, `title`) values (?, ?, ?, ?, ?, ?, ?, ?)',
  //     [
  //       newCurriculumAssessmentWithFreeResponseQuestion.activity_id,
  //       newCurriculumAssessmentWithFreeResponseQuestion.curriculum_id,
  //       newCurriculumAssessmentWithFreeResponseQuestion.description,
  //       newCurriculumAssessmentWithFreeResponseQuestion.max_num_submissions,
  //       newCurriculumAssessmentWithFreeResponseQuestion.max_score,
  //       newCurriculumAssessmentWithFreeResponseQuestion.principal_id,
  //       newCurriculumAssessmentWithFreeResponseQuestion.time_limit,
  //       newCurriculumAssessmentWithFreeResponseQuestion.title,
  //     ],
  //     [updatedCurriculumAssessment.id]
  //   );
  //   mockQuery(
  //     'insert into `assessment_questions` (`assessment_id`, `description`, `max_score`, `question_type_id`, `sort_order`, `title`) values (?, ?, ?, ?, ?, ?)',
  //     [
  //       updatedCurriculumAssessment.id,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0]
  //         .description,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].max_score,
  //       2,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].sort_order,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].title,
  //     ],
  //     [updatedFreeResponseQuestion.id]
  //   );
  //   mockQuery(
  //     'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
  //     [
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].answers[0]
  //         .description,
  //       updatedFreeResponseQuestion.id,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].answers[0]
  //         .sort_order,
  //       newCurriculumAssessmentWithFreeResponseQuestion.questions[0].answers[0]
  //         .title,
  //     ],
  //     [updatedFreeResponseAnswer.id]
  //   );
  //   mockQuery(
  //     'update `assessment_questions` set `correct_answer_id` = ? where `id` = ?',
  //     [updatedFreeResponseAnswer.id, updatedFreeResponseQuestion.id],
  //     []
  //   );
  //   expect(
  //     await createCurriculumAssessment(
  //       newCurriculumAssessmentWithFreeResponseQuestion
  //     )
  //   ).toEqual(updatedCurriculumAssessmentWithFreeResponseQuestion);
  // });
});

describe('createProgramAssessment', () => {
  it('should insert a ProgramAssessment into the database', async () => {
    mockQuery(
      'insert into `program_assessments` (`assessment_id`, `available_after`, `due_date`, `program_id`) values (?, ?, ?, ?)',
      [
        sentNewProgramAssessment.assessment_id,
        sentNewProgramAssessment.available_after,
        sentNewProgramAssessment.due_date,
        sentNewProgramAssessment.program_id,
      ],
      [newProgramAssessmentsRow.id]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [sentNewProgramAssessment.program_id],
      [matchingProgramRow]
    );

    expect(await createProgramAssessment(sentNewProgramAssessment)).toEqual(
      exampleProgramAssessment
    );
  });
});

describe('deleteCurriculumAssessment', () => {
  it('should delete  a CurriculumAssessment from  the database', async () => {
    mockQuery(
      'delete from `curriculum_assessments` where `id` = ?',
      [curriculumAssessmentId],
      [1]
    );

    expect(await deleteCurriculumAssessment(curriculumAssessmentId)).toEqual([
      1,
    ]);
  });
});

describe('deleteProgramAssessment', () => {
  it('should delete a ProgramAssessment from  the database', async () => {
    mockQuery(
      'delete from `program_assessments` where `id` = ?',
      [programAssessmentId],
      [1]
    );

    expect(await deleteProgramAssessment(programAssessmentId)).toEqual([1]);
  });
});

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
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
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
      [matchingProgramAssessmentsRow]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [exampleProgramAssessment.program_id],
      [matchingProgramRow]
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
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionsRowGraded]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentResponsesRowSCGraded]
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(exampleAssessmentSubmissionGraded);
  });

  it('should get assessment submission with null for responses (if no responses found) based on given submission ID', async () => {
    const assessmentSubmissionId = matchingAssessmentSubmissionOpenedRow.id;
    const responsesIncluded = true;
    const gradingsIncluded = true;

    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
      [assessmentSubmissionId],
      [matchingAssessmentSubmissionOpenedRow]
    );

    mockQuery(
      'select `id`, `assessment_id`, `question_id`, `answer_id`, `response`, `score`, `grader_response` from `assessment_responses` where `submission_id` = ?',
      [assessmentSubmissionId],
      []
    );

    expect(
      await getAssessmentSubmission(
        assessmentSubmissionId,
        responsesIncluded,
        gradingsIncluded
      )
    ).toEqual(exampleAssessmentSubmissionOpened);
  });

  it('should return null for a assessment submission ID that does not exist', async () => {
    mockQuery(
      'select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',
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
  //  it('should return a CurriculumAssessment for an existing curriculum assessment ID', async () => {
  //   const questionsAndAllAnswersIncluded = true,
  //     questionsAndCorrectAnswersIncluded = true;

  //   mockQuery(
  //     'select `curriculum_assessments`.`title`, `curriculum_assessments`.`max_score`, `curriculum_assessments`.`max_num_submissions`, `curriculum_assessments`.`time_limit`, `curriculum_assessments`.`curriculum_id`, `curriculum_assessments`.`activity_id`, `curriculum_assessments`.`principal_id` from `curriculum_assessments` inner join `activities` on `curriculum_assessments`.`curriculum_id` = `activities`.`id` where `curriculum_assessments`.`id` = ?',
  //     [curriculumAssessmentId],
  //     [matchingCurriculumAssessmentRow]
  //   );
  //   mockQuery(
  //     'select `activity_types`.`title` from `activity_types` inner join `activities` on `activities`.`activity_type_id` = `activity_types`.`id` where `activities`.`id` = ?',
  //     [matchingCurriculumAssessmentRow.activity_id],
  //     [{ title: exampleCurriculumAssessmentWithCorrectAnswers.assessment_type }]
  //   );
  //   mockQuery(
  //     'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
  //     [exampleCurriculumAssessmentWithCorrectAnswers.id],
  //     [matchingAssessmentQuestionsRow]
  //   );

  //   const questionIds = [matchingAssessmentQuestionsRow.id];

  //   mockQuery(
  //     'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
  //     [questionIds[0]],
  //     [matchingAssessmentAnswersSCRow]
  //   );

  //   expect(
  //     await getCurriculumAssessment(
  //       exampleCurriculumAssessmentWithCorrectAnswers.id,
  //       questionsAndAllAnswersIncluded,
  //       questionsAndCorrectAnswersIncluded
  //     )
  //   ).toEqual(exampleCurriculumAssessmentWithCorrectAnswers);
  // });

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
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [facilitatorPrincipalId, exampleProgramAssessment.program_id],
      [matchingProgramParticipantRoleFacilitatorRow]
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
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
      [participantPrincipalId, exampleProgramAssessment.program_id],
      [matchingProgramParticipantRoleParticipantRow]
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
      'select `program_participant_roles`.`title` from `program_participant_roles` inner join `program_participants` on `program_participant_roles`.`id` = `program_participants`.`role_id` where `principal_id` = ? and `program_id` = ?',
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
  // it('should return all questions of a given curriculum assessment based on specified boolean parameter', async () => {
  //   const answersIncluded = true;
  //   mockQuery(
  //     'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
  //     [exampleCurriculumAssessment.id],
  //     [matchingAssessmentQuestionsRow]
  //   );

  //   const questionIds = [matchingAssessmentQuestionsRow.id];

  //   mockQuery(
  //     'select `id`, `question_id`, `title`, `description`, `sort_order` from `assessment_answers` where `question_id` = ? order by `sort_order` asc',
  //     [questionIds[0]],
  //     [matchingAssessmentAnswersSCRow]
  //   );

  //   expect(
  //     await listAssessmentQuestions(
  //       exampleCurriculumAssessment.id,
  //       answersIncluded
  //     )
  //   ).toEqual(exampleAssessmentQuestionsWithCorrectAnswers);
  // });

  it('should return null if no questions are found', async () => {
    const answersIncluded = true;
    mockQuery(
      'select `assessment_questions`.`id`, `assessment_questions`.`title`, `description`, `assessment_question_types`.`title` as `question_type`, `correct_answer_id`, `max_score`, `sort_order` from `assessment_questions` inner join `assessment_question_types` on `assessment_questions`.`question_type_id` = `assessment_question_types`.`id` where `assessment_questions`.`assessment_id` = ? order by `sort_order` asc',
      [exampleCurriculumAssessment.id],
      []
    );

    expect(
      await listAssessmentQuestions(
        exampleCurriculumAssessment.id,
        answersIncluded
      )
    ).toEqual(null);
  });
});

describe('listAllProgramAssessmentSubmissions', () => {
  it('should return all program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
      [exampleAssessmentSubmissionOpened.assessment_id],
      [
        matchingAssessmentSubmissionOpenedRow,
        matchingOtherAssessmentSubmissionSubmittedRow,
        matchingAssessmentSubmissionsRowGraded,
      ]
    );

    expect(
      await listAllProgramAssessmentSubmissions(
        exampleAssessmentSubmissionOpened.assessment_id
      )
    ).toEqual([
      exampleAssessmentSubmissionOpened,
      exampleOtherAssessmentSubmissionSubmitted,
      exampleAssessmentSubmissionGradedNoResponses,
    ]);
  });

  it('should return null if no program assessment submissions for a given program assessment', async () => {
    mockQuery(
      'select `assessment_submissions`.`id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`principal_id`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_id` = ?',
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
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleAssessmentSubmissionOpened.assessment_id],
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
      'select `assessment_submissions`.`id` as `id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`principal_id` = ? and `assessment_submissions`.`assessment_id` = ?',
      [participantPrincipalId, exampleAssessmentSubmissionOpened.assessment_id],
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

describe('listPrincipalEnrolledProgramIds', () => {
  const enrolledProgramsList = [{ program_id: 2 }];
  it('should return program Id list for  which a principal is ficilitator ', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [facilitatorPrincipalId],
      enrolledProgramsList
    );
    expect(
      await listPrincipalEnrolledProgramIds(facilitatorPrincipalId)
    ).toEqual([enrolledProgramsList[0].program_id]);
  });
  it('should return program Id list for  which a principal is participant enrolloed in program ', async () => {
    mockQuery(
      'select `program_id` from `program_participants` where `principal_id` = ?',
      [participantPrincipalId],
      enrolledProgramsList
    );
    expect(
      await listPrincipalEnrolledProgramIds(participantPrincipalId)
    ).toEqual([enrolledProgramsList[0].program_id]);
  });
});

describe('listProgramAssessments', () => {
  it('should return all ProgramAssessments linked to a program ID', async () => {
    mockQuery(
      'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      [matchingProgramAssessmentsRow]
    );

    mockQuery(
      'select `id`, `title`, `start_date`, `end_date`, `time_zone`, `curriculum_id` from `programs` where `id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      [matchingProgramRow]
    );

    expect(
      await listProgramAssessments(matchingProgramAssessmentsRow.program_id)
    ).toEqual([exampleProgramAssessment]);
  });

  it('should return null if no ProgramAssessments linked to a program ID were found', async () => {
    mockQuery(
      'select `id`, `assessment_id`, `available_after`, `due_date` from `program_assessments` where `program_id` = ?',
      [matchingProgramAssessmentsRow.program_id],
      []
    );

    expect(
      await listProgramAssessments(matchingProgramAssessmentsRow.program_id)
    ).toEqual(null);
  });
});

describe('removeGradingInformation', () => {
  it('should remove all grading-related information from an AssessmentSubmission', () => {
    expect(removeGradingInformation(exampleAssessmentSubmissionGraded)).toEqual(
      exampleAssessmentSubmissionGradedRemovedGrades
    );
  });
});

// describe('updateAssessmentSubmission', () => {
//   it('should return update for an existing assessment submission for participant ', async () => {
//     mockQuery(
//       'update `assessment_responses` set `answer_id` = ?, `response` = ? where `id` = ? ',
//       [
//         sentUpdatedAssessmentSubmissionSCResponseSubmitted.answer_id,
//         sentUpdatedAssessmentSubmissionSCResponseSubmitted.response_text,
//         sentUpdatedAssessmentSubmissionSCResponseSubmitted.id,
//       ],

//       []
//     );
//     mockQuery('select `id` from `assessment_submission_states` where `title` = ?',
//     ['In Progress'],
//     4)
//     mockQuery(
//       'update `assessment_submissions` set `assessment_submission_state_id` = ?, `score` = ? where `id` = ?',
//       [
//         4,
//         sentUpdatedAssessmentSubmissionChangedResponse.score,
//         sentUpdatedAssessmentSubmissionChangedResponse.id,
//       ],
//       1

//     );

//     expect(
//       await updateAssessmentSubmission(sentUpdatedAssessmentSubmissionChangedResponse)
//     ).toEqual(updatedAssessmentSubmissionsRow);
//   });
//   it('should return update for an existing assessment submission for facilitator ', async () => {
//   //  mockQuery('select `assessment_submissions`.`assessment_id`, `assessment_submissions`.`principal_id`, `assessment_submission_states`.`title` as `assessment_submission_state`, `assessment_submissions`.`score`, `assessment_submissions`.`opened_at`, `assessment_submissions`.`submitted_at`, `assessment_submissions`.`updated_at` from `assessment_submissions` inner join `assessment_submission_states` on `assessment_submissions`.`assessment_submission_state_id` = `assessment_submission_states`.`id` where `assessment_submissions`.`id` = ?',[assessmentSubmissionId],[

//   //  ])

//     mockQuery(
//       'update `assessment_responses` set `score` = ?, `grader_response` = ? where `id` = ?',
//       [
//         sentUpdatedAssessmentSubmissionSCResponseGraded.score,
//         sentUpdatedAssessmentSubmissionSCResponseGraded.grader_response,
//         sentUpdatedAssessmentSubmissionSCResponseGraded.id,
//       ],

//       1
//     );
//     mockQuery('select `id` from `assessment_submission_states` where `title` = ?',
//     ['In Progress'],
//     4)
//     mockQuery(
//       'update `assessment_submissions` set `assessment_submission_state_id` = ?, `score` = ? where `id` = ?',
//       [
//         4,
//         updatedAssessmentResponsesSCGradedRow.score,
//         updatedAssessmentResponsesSCGradedRow.id,
//       ],
//       []
//     );

//     expect(
//       await updateAssessmentSubmission(sentUpdatedAssessmentSubmissionChangedResponse)
//     ).toEqual(updatedAssessmentSubmissionsRow);
//   });
// });

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

describe('updateCurriculumAssessment with existing questions and existing answers', () => {
  it('should return', async () => {
    mockQuery(
      'update `assessment_answers` set `title` = ?, `description` = ?, `sort_order` = ? where `id` = ?',
      [
        matchingAssessmentAnswersSCRow.title,
        null,
        matchingAssessmentAnswersSCRow.sort_order,
        singleChoiceAnswerId,
      ],
      [exampleCurriculumAssessmentWithQuestions.questions[0].answers[0]]
    );
    mockQuery(
      'update `assessment_questions` set `title` = ?, `question_type` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsRow.title,
        matchingAssessmentQuestionsRow.question_type,
        matchingAssessmentQuestionsRow.max_score,
        matchingAssessmentQuestionsRow.sort_order,
        singleChoiceQuestionId,
      ],
      [exampleAssessmentQuestionsWithoutCorrectAnswers[0]]
    );
    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `assessment_type` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `questions` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        exampleCurriculumAssessment.assessment_type,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        exampleAssessmentQuestionsWithoutCorrectAnswers,
        curriculumAssessmentId,
      ],
      [exampleCurriculumAssessment]
    );
    expect(
      await updateCurriculumAssessment(exampleCurriculumAssessmentWithQuestions)
    ).toEqual(exampleCurriculumAssessmentWithQuestions);
  });
});

describe('updateCurriculumAssessment with existing questions and no answers', () => {
  it('should return', async () => {
    mockQuery(
      'insert into `assessment_answers` (`description`, `question_id`, `sort_order`, `title`) values (?, ?, ?, ?)',
      [
        matchingAssessmentAnswersSCRow.description,
        singleChoiceQuestionId,
        matchingAssessmentAnswersSCRow.sort_order,
        matchingAssessmentAnswersSCRow.title,
      ],
      [singleChoiceAnswerId]
    );
    mockQuery(
      'update `assessment_questions` set `title` = ?, `question_type` = ?, `max_score` = ?, `sort_order` = ? where `id` = ?',
      [
        matchingAssessmentQuestionsRow.title,
        matchingAssessmentQuestionsRow.question_type,
        matchingAssessmentQuestionsRow.max_score,
        matchingAssessmentQuestionsRow.sort_order,
        singleChoiceQuestionId,
      ],
      [exampleAssessmentQuestionsWithNewAnswers[0]]
    );
    mockQuery(
      'update `curriculum_assessments` set `title` = ?, `assessment_type` = ?, `description` = ?, `max_score` = ?, `max_num_submissions` = ?, `time_limit` = ?, `questions` = ? where `id` = ?',
      [
        matchingCurriculumAssessmentRow.title,
        exampleCurriculumAssessment.assessment_type,
        matchingCurriculumAssessmentRow.description,
        matchingCurriculumAssessmentRow.max_score,
        matchingCurriculumAssessmentRow.max_num_submissions,
        matchingCurriculumAssessmentRow.time_limit,
        exampleCurriculumAssessmentWithQuestionsNewAnswers.questions,
        curriculumAssessmentId,
      ],
      [exampleCurriculumAssessmentWithQuestionsNewAnswers]
    );
    expect(
      await updateCurriculumAssessment(
        exampleCurriculumAssessmentWithQuestionsNewAnswers
      )
    ).toEqual(exampleCurriculumAssessmentWithQuestions);
  });
});
