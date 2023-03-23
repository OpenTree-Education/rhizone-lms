import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
import {
  getProgramIdByProgramAssessmentId,
  findRoleInProgram,
  programAssessmentById,
  getCurriculumAssessmentById,
  submissionDetails,
  principalEnrolledPrograms,
  getAssessmentsForProgram,
  getFacilitatorAssessmentSubmissionsSummary,
  deleteAssessmentById,
  getAssessmentSubmissionsSummary,
  getParticipantAssessmentSubmissionsSummary,
} from '../../services/assessmentService';

import {
  CurriculumAssessment,
  ParticipantAssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentWithSummary,
  ProgramAssessment,
  SavedAssessment,
  AssessmentSubmission,
} from '../../../src/models';

jest.mock('../../services/assessmentService');

const mockPrincipalEnrolledPrograms = jest.mocked(principalEnrolledPrograms);
const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockGetAssessmentsForProgram = jest.mocked(getAssessmentsForProgram);
const mockGetCurriculumAssessmentById = jest.mocked(
  getCurriculumAssessmentById
);
const mockGetParticipantAssessmentSubmissionsSummary = jest.mocked(
  getParticipantAssessmentSubmissionsSummary
);
const mockGetFacilitatorAssessmentSubmissionsSummary = jest.mocked(
  getFacilitatorAssessmentSubmissionsSummary
);
const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);
const mockProgramAssessmentById = jest.mocked(programAssessmentById);
const mockSubmissionDetails = jest.mocked(submissionDetails);
const mockDeleteAssessmentById = jest.mocked(deleteAssessmentById);

const administratorPrincipalId = 3;
const participantPrincipalId = 30;
const unenrolledPrincipalId = 31;
const otherParticipantPrincipalId = 32;
const facilitatorPrincipalId = 300;

const exampleCurriculumAssessment: CurriculumAssessment = {
  id: 12,
  title: 'Assignment 1: React',
  assessment_type: 'test',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 3,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: administratorPrincipalId,
};

const exampleCurriculumAssessmentWithQuestions: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [
    {
      id: 1,
      assessment_id: exampleCurriculumAssessment.id,
      title: 'What is React?',
      question_type: 'single choice',
      answers: [
        {
          id: 1,
          question_id: 1,
          title: 'A relational database management system',
          sort_order: 1,
        },
      ],
      max_score: 1,
      sort_order: 1,
    },
  ],
};

const exampleCurriculumAssessmentWithCorrectAnswers: CurriculumAssessment = {
  ...exampleCurriculumAssessment,
  questions: [
    {
      id: 1,
      assessment_id: exampleCurriculumAssessment.id,
      title: 'What is React?',
      question_type: 'single choice',
      answers: [
        {
          id: 1,
          question_id: 1,
          title: 'A relational database management system',
          sort_order: 1,
          correct_answer: true,
        },
      ],
      correct_answer_id: 1,
      max_score: 1,
      sort_order: 1,
    },
  ],
};

const exampleProgramAssessment: ProgramAssessment = {
  id: 15,
  program_id: 1,
  assessment_id: 12,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};

const exampleParticipantAssessmentSubmissionsSummary: ParticipantAssessmentSubmissionsSummary =
  {
    principal_id: participantPrincipalId,
    highest_state: 'Graded',
    most_recent_submitted_date: '2023-02-09 13:23:45',
    total_num_submissions: 1,
    highest_score: 10,
  };

const exampleFacilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 8,
    num_program_participants: 12,
    num_ungraded_submissions: 6,
  };

const exampleAssessmentSubmissionInProgress: AssessmentSubmission = {
  id: 2,
  assessment_id: exampleProgramAssessment.id,
  principal_id: participantPrincipalId,
  assessment_submission_state: 'In Progress',
  opened_at: '2023-02-09 12:00:00',
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      answer_id: 1,
    },
  ],
};

const exampleAssessmentSubmissionSubmitted: AssessmentSubmission = {
  ...exampleAssessmentSubmissionInProgress,
  assessment_submission_state: 'Submitted',
  submitted_at: '2023-02-09 13:23:45',
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      answer_id: 1,
    },
  ],
};

const exampleAssessmentSubmissionGraded = {
  ...exampleAssessmentSubmissionSubmitted,
  assessment_submission_state: 'Graded',
  score: 1,
  responses: [
    {
      id: 1,
      assessment_id: exampleProgramAssessment.id,
      submission_id: 2,
      question_id: 1,
      answer_id: 1,
      score: 1,
      grader_response: 'Well done!',
    },
  ],
};

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);

  describe('GET /', () => {
    it('should respond with an empty list for a user not enrolled in any programs', done => {
      mockPrincipalEnrolledPrograms.mockResolvedValue([]);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent.get('/').expect(200, collectionEnvelope([], 0), err => {
        expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
          unenrolledPrincipalId
        );
        done(err);
      });
    });

    it('should respond with a list of all assessments (without questions) for participant enrolled in one program', done => {
      const participantAssessmentListResponse: AssessmentWithSummary[] = [
        {
          curriculum_assessment: exampleCurriculumAssessment,
          program_assessment: exampleProgramAssessment,
          participant_submissions_summary:
            exampleParticipantAssessmentSubmissionsSummary,
          principal_program_role: 'Participant',
        },
      ];

      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with participant for that one program
      mockFindRoleInProgram.mockResolvedValue('Participant');
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue([
        exampleProgramAssessment,
      ]);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(
        exampleCurriculumAssessment
      );
      // mock responses from (call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program) to respond with the assessment summary for every program assessment that participant has submitted for previously
      mockGetParticipantAssessmentSubmissionsSummary.mockResolvedValue(
        exampleParticipantAssessmentSubmissionsSummary
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            participantAssessmentListResponse,
            participantAssessmentListResponse.length
          ),
          err => {
            // call a (mock) function that gets a list of programs the user is enrolled in
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              participantPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockGetAssessmentsForProgram).toHaveBeenCalledWith(
              exampleProgramAssessment.program_id
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program
            expect(
              mockGetParticipantAssessmentSubmissionsSummary
            ).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              participantPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for facilitator of one program', done => {
      const facilitatorAssessmentListResponse: AssessmentWithSummary[] = [
        {
          curriculum_assessment: exampleCurriculumAssessment,
          program_assessment: exampleProgramAssessment,
          facilitator_submissions_summary:
            exampleFacilitatorAssessmentSubmissionsSummary,
          principal_program_role: 'Facilitator',
        },
      ];

      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with facilitator for that one program
      mockFindRoleInProgram.mockResolvedValue('Facilitator');
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue([
        exampleProgramAssessment,
      ]);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(
        exampleCurriculumAssessment
      );
      // mock responses from (call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program) to respond with the assessment summary for all participants for each program assessment
      mockGetFacilitatorAssessmentSubmissionsSummary.mockResolvedValue(
        exampleFacilitatorAssessmentSubmissionsSummary
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(
            facilitatorAssessmentListResponse,
            facilitatorAssessmentListResponse.length
          ),
          err => {
            // call a (mock) function that gets a list of programs the user is facilitating
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              facilitatorPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockGetAssessmentsForProgram).toBeCalledWith(
              exampleProgramAssessment.program_id
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program
            expect(
              mockGetFacilitatorAssessmentSubmissionsSummary
            ).toHaveBeenCalledWith(exampleProgramAssessment.assessment_id);
            done(err);
          }
        );
    });

    // it('should respond with an error if an error occurs fetching information from the database', done => {
    //   // mock response from function that gets a list of programs the user is enrolled in to reject the database call
    //   mockPrincipalEnrolledPrograms.mockRejectedValue(new Error());

    //   mockPrincipalId(participantPrincipalId);

    //   appAgent
    //     .get('/')
    //     .expect(500, errorEnvelope('Internal server error.'), err => {
    //       expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
    //         participantPrincipalId
    //       );
    //       done(err);
    //     });
    // });
  });

  // describe('POST /', () => {
  //   it('should create a new assessment', done => {
  //     const response = { behaviour: 'Creates a new assessment' };
  //     appAgent.post('/').expect(200, itemEnvelope(response), err => {
  //       done(err);
  //     });
  //   });
  // });

  // describe('GET /:assessmentId', () => {
  //   it('should show a single assessment', done => {
  //     const response = { behaviour: 'Shows a single assessment' };
  //     appAgent
  //       .get(`/${exampleProgramAssessment.id}`)
  //       .expect(200, itemEnvelope(response), err => {
  //         done(err);
  //       });
  //   });
  // });

  // describe('PUT /:assessmentId', () => {
  //   it('should edit an assessment in the system', done => {
  //     const response = { behaviour: 'Edits an assessment in the system' };
  //     appAgent
  //       .put(`/${exampleProgramAssessment.id}`)
  //       .expect(200, itemEnvelope(response), err => {
  //         done(err);
  //       });
  //   });
  // });

  // describe('DELETE /:assessmentId', () => {
  //   it('should delete a program assessment in the system if logged-in user is facilitator of that program', done => {
  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.program_id,
  //   );
  //     mockFindRoleInProgram.mockResolvedValue('Facilitator');

  //     mockPrincipalId(facilitatorPrincipalId);
  //     appAgent
  //       .delete(`/${exampleProgramAssessment.id}`)
  //       .expect(204, null, err => {
  //         expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );
  //         expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //           facilitatorPrincipalId,
  //           exampleProgramAssessment.program_id
  //         );
  //         expect(mockDeleteAssessmentById).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );
  //         done(err);
  //       });
  //   });

  //   it('should return an error if logged-in user is not a facilitator of that program', done => {
  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.program_id,
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');

  //     mockPrincipalId(participantPrincipalId);
  //     appAgent
  //       .delete(`/${exampleProgramAssessment.id}`)
  //       .expect(
  //         401,
  //         errorEnvelope('The requester does not have access to the resource.'),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           done(err);
  //         }
  //       );
  //   });
  // });

  // describe('GET /:assessmentId/submissions/:submissionId', () => {
  //   it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
  //     const facilitatorFullResponse: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
  //       program_assessment: exampleProgramAssessment,
  //       submission: exampleAssessmentSubmissionSubmitted,
  //       principal_program_role: 'Facilitator',
  //     };

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Facilitator');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithCorrectAnswers
  //     );
  //     mockSubmissionDetails.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );

  //     mockPrincipalId(facilitatorPrincipalId);

  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(200, itemEnvelope(facilitatorFullResponse), err => {
  //         expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );
  //         expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //           facilitatorPrincipalId,
  //           exampleProgramAssessment.program_id
  //         );
  //         expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );
  //         expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //           exampleProgramAssessment.assessment_id,
  //           true,
  //           true
  //         );
  //         expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //           exampleAssessmentSubmissionSubmitted.id,
  //           true
  //         );

  //         done(err);
  //       });
  //   });

  //   it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
  //     const participantInProgressAssessmentSubmission: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
  //       program_assessment: exampleProgramAssessment,
  //       submission: exampleAssessmentSubmissionInProgress,
  //       principal_program_role: 'Participant',
  //     };

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );
  //     mockSubmissionDetails.mockResolvedValue(
  //       exampleAssessmentSubmissionInProgress
  //     );

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionInProgress.id}`
  //       )
  //       .expect(
  //         200,
  //         itemEnvelope(participantInProgressAssessmentSubmission),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
  //           );
  //           expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionInProgress.id,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should show a participant their submission information for an ungraded submitted assessment without including the correct answers', done => {
  //     const participantSubmittedAssessmentSubmission: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
  //       program_assessment: exampleProgramAssessment,
  //       submission: exampleAssessmentSubmissionSubmitted,
  //       principal_program_role: 'Participant',
  //     };

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );
  //     mockSubmissionDetails.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(
  //         200,
  //         itemEnvelope(participantSubmittedAssessmentSubmission),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
  //           );
  //           expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionSubmitted.id,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should show a participant their submission information for a graded submitted assessment including the correct answers', done => {
  //     const participantGradedAssessmentSubmission: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
  //       program_assessment: exampleProgramAssessment,
  //       submission: exampleAssessmentSubmissionGraded,
  //       principal_program_role: 'participant',
  //     };

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithCorrectAnswers
  //     );
  //     mockSubmissionDetails.mockResolvedValue(
  //       exampleAssessmentSubmissionGraded
  //     );

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionGraded.id}`
  //       )
  //       .expect(
  //         200,
  //         itemEnvelope(participantGradedAssessmentSubmission),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             true
  //           );
  //           expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionGraded.id,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with a bad request error if given an invalid assessment id', done => {
  //     const programAssessmentId = 'test';
  //     appAgent
  //       .get(
  //         `/${programAssessmentId}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(
  //         400,
  //         errorEnvelope(
  //           'The request could not be completed with the given parameters.'
  //         ),
  //         done
  //       );
  //   });

  //   it('should respond with a NotFoundError if the assessment id was not found in the database', done => {
  //     const programAssessmentId = 7;

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(null);
  //     appAgent
  //       .get(
  //         `/${programAssessmentId}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(
  //         404,
  //         errorEnvelope('The requested resource does not exist.'),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             programAssessmentId
  //           );
  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with a bad request error if given an invalid submission id ', done => {
  //     const submissionId = 'test';

  //     appAgent
  //       .get(`/${exampleProgramAssessment.id}/submissions/${submissionId}`)
  //       .expect(
  //         400,
  //         errorEnvelope(
  //           'The request could not be completed with the given parameters.'
  //         ),
  //         done
  //       );
  //   });

  //   it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
  //     const submissionId = 8;

  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );
  //     mockSubmissionDetails.mockResolvedValue(null);

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(`/${exampleProgramAssessment.id}/submissions/${submissionId}`)
  //       .expect(
  //         404,
  //         errorEnvelope('The requested resource does not exist.'),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
  //           );
  //           expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //             submissionId,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with an Unauthorized Error if the logged-in principal id is not the same as the principal id of the submission id and is not the principal id of the program facilitator', done => {
  //     mockGetProgramIdByProgramAssessmentId.mockResolvedValue(
  //       exampleProgramAssessment.id
  //     );
  //     mockFindRoleInProgram.mockResolvedValue('Participant');
  //     mockProgramAssessmentById.mockResolvedValue(exampleProgramAssessment);
  //     mockGetCurriculumAssessmentById.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );
  //     mockSubmissionDetails.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );

  //     mockPrincipalId(otherParticipantPrincipalId);

  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(
  //         401,
  //         errorEnvelope('The requester does not have access to the resource.'),
  //         err => {
  //           expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockFindRoleInProgram).toHaveBeenCalledWith(
  //             otherParticipantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );
  //           expect(mockProgramAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );
  //           expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
  //           );
  //           expect(mockSubmissionDetails).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionSubmitted.id,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with an internal server error if a database error occurs', done => {
  //     mockGetProgramIdByProgramAssessmentId.mockRejectedValue(new Error());
  //     appAgent
  //       .get(
  //         `/${exampleProgramAssessment.id}/submissions/${exampleAssessmentSubmissionSubmitted.id}`
  //       )
  //       .expect(500, errorEnvelope('Internal server error.'), err => {
  //         expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );
  //         done(err);
  //       });
  //   });
  // });

  // describe('PUT /:assessmentId/submissions/:submissionId', () => {
  //   it('should update the state of a submission', done => {
  //     const response = { behaviour: 'Updates the state of a submission' };
  //     appAgent
  //       .put(`/${exampleAssessmentId}/submissions/${exampleSubmissionId}`)
  //       .expect(200, itemEnvelope(response), err => {
  //         done(err);
  //       });
  //   });
  // });

  // describe('GET /:assessmentId/submissions/new', () => {
  //   it('should create a new draft submission', done => {
  //     const response = { behaviour: 'Creates a new draft submission' };
  //     appAgent
  //       .get(`/${exampleAssessmentId}/submissions/new`)
  //       .expect(200, itemEnvelope(response), err => {
  //         done(err);
  //       });
  //   });
  // });
});
