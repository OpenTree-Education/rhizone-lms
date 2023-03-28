import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import { SavedAssessment } from '../../models';
import {
  exampleCurriculumAssessment,
  exampleCurriculumAssessmentWithCorrectAnswers,
  exampleProgramAssessment,
  exampleProgramAssessmentPastDue,
  exampleProgramAssessmentNotAvailable,
  exampleAssessmentSubmissionSubmitted,
  facilitatorPrincipalId,
  exampleCurriculumAssessmentWithQuestions,
  exampleAssessmentSubmissionInProgress,
  participantPrincipalId,
  exampleAssessmentSubmissionGraded,
  otherParticipantPrincipalId,
} from '../../assets/data';
import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../../services/assessmentsService';

import assessmentsRouter from '../assessmentsRouter';

jest.mock('../../services/assessmentsService');

const mockConstructFacilitatorAssessmentSummary = jest.mocked(
  constructFacilitatorAssessmentSummary
);
const mockConstructParticipantAssessmentSummary = jest.mocked(
  constructParticipantAssessmentSummary
);
const mockCreateAssessmentSubmission = jest.mocked(createAssessmentSubmission);
const mockCreateCurriculumAssessment = jest.mocked(createCurriculumAssessment);
const mockCreateProgramAssessment = jest.mocked(createProgramAssessment);
const mockDeleteCurriculumAssessment = jest.mocked(deleteCurriculumAssessment);
const mockDeleteProgramAssessment = jest.mocked(deleteProgramAssessment);
const mockFindProgramAssessment = jest.mocked(findProgramAssessment);
const mockGetAssessmentSubmission = jest.mocked(getAssessmentSubmission);
const mockGetCurriculumAssessment = jest.mocked(getCurriculumAssessment);
const mockGetPrincipalProgramRole = jest.mocked(getPrincipalProgramRole);
const mockListParticipantProgramAssessmentSubmissions = jest.mocked(
  listParticipantProgramAssessmentSubmissions
);
const mockListPrincipalEnrolledProgramIds = jest.mocked(
  listPrincipalEnrolledProgramIds
);
const mockListProgramAssessments = jest.mocked(listProgramAssessments);
const mockUpdateAssessmentSubmission = jest.mocked(updateAssessmentSubmission);
const mockUpdateCurriculumAssessment = jest.mocked(updateCurriculumAssessment);
const mockUpdateProgramAssessment = jest.mocked(updateProgramAssessment);

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);

  describe('GET /', () => {});

  describe('GET /curriculum/:curriculumAssessmentId', () => {});
  describe('POST /curriculum', () => {});
  describe('PUT /curriculum/:curriculumAssessmentId', () => {});
  describe('DELETE /curriculum/:curriculumAssessmentId', () => {});

  describe('GET /program/:programAssessmentId', () => {});
  describe('POST /program', () => {});
  describe('PUT /program/:programAssessmentId', () => {});
  describe('DELETE /program/:programAssessmentId', () => {});

  describe('GET /program/:programAssessmentId/submissions', () => {});
  describe('GET /program/:programAssessmentId/submissions/new', () => {
    it('should respond with a bad request error if given an invalid assessment id', done => {
      const programAssessmentInvalidId = 'test';
      appAgent
        .get(`/program/${programAssessmentInvalidId}/submissions/new`)
        .expect(
          400,
          errorEnvelope(
            'The request could not be completed with the given parameters.'
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the assessment id was not found in the database', done => {
      const programAssessmentNotFoundId = 0;
      mockPrincipalId(participantPrincipalId);
      mockFindProgramAssessment.mockResolvedValue(null);
      appAgent
        .get(`/program/${programAssessmentNotFoundId}/submissions/new`)
        .expect(
          404,
          errorEnvelope('The requested resource does not exist.'),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessmentNotFoundId
            );
            done(err);
          }
        );
    });
    it('should return an error when attempting to create a submission for a program assessment that is not yet available', done => {
      mockPrincipalId(participantPrincipalId);
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessmentNotAvailable);
      appAgent
        .get(`/program/${exampleProgramAssessmentNotAvailable.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope('The assessment is not yet available for a new submission.'),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentNotAvailable.id
            );
            done(err);
        });
    });
    it('should return an error when attempting to create a submission when the program assessment due date has passed', done => {
      mockPrincipalId(participantPrincipalId);
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessmentPastDue);
      appAgent
        .get(`/program/${exampleProgramAssessmentPastDue.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope('The assessment has expired, thus unable to create a new submission.'),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentPastDue.id
            );
            done(err);
        });
    });

    it('should return an error if logged-in user is not enrolled in the program', done => {
      mockPrincipalId(participantPrincipalId);
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            done(err);
          }
        );
    });
    it('should return an error if logged-in user is a facilitator', done => {
      mockPrincipalId(facilitatorPrincipalId);
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue("Facilitator");
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            done(err);
          }
        );
    });
    // it('should return an error if no possible submissions remain for this participant and this assessment', done => {
    //   mockPrincipalId(participantPrincipalId);
    //   mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
    //   mockGetPrincipalProgramRole.mockResolvedValue("Participant");
    //   mockGetCurriculumAssessment.mockResolvedValue(exampleCurriculumAssessment);
    //   mockGetCurriculumAssessment.mockResolvedValue(exampleCurriculumAssessment);
    //   mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([exampleAssessmentSubmissionSubmitted, exampleAssessmentSubmissionSubmitted,exampleAssessmentSubmissionSubmitted]);
    //   appAgent
    //     .get(`/program/${exampleProgramAssessment.id}/submissions/new`)

    //     .expect(
    //       401,
    //       errorEnvelope('The assessment has reached the max number of submission limit.'),
    //       err => {
    //       expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockFindRoleInProgram).toHaveBeenCalledWith(
    //         participantPrincipalId,
    //         exampleProgramAssessment.program_id
    //       );
    //       expect(mockProgramAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.assessment_id,
    //         true,
    //         false
    //       );
    //       expect(mockCreateNewSubmission).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id,
    //         participantPrincipalId
    //       );
    //       expect(mockGetSubmissionById).toHaveBeenCalledWith(
    //         exampleAssessmentSubmissionOpened.id
    //       );
    //       done(err);
    //     });
    // });
    // it('should return an error when attempting to create a new submission but one is currently opened or in progress', done => {
    //   const participantOpenedAssessmentSubmission: SavedAssessment = {
    //     curriculum_assessment: exampleCurriculumAssessment,
    //     program_assessment: exampleProgramAssessment,
    //     submission: exampleAssessmentSubmissionOpened,
    //     principal_program_role: 'participant',
    //   };

    //   mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
    //     { program_id: exampleProgramAssessment.program_id },
    //   ]);
    //   mockFindRoleInProgram.mockResolvedValue({ title: 'Participant' });
    //   mockProgramAssessmentById.mockResolvedValue([exampleProgramAssessment]);
    //   mockGetCurriculumAssessmentById.mockResolvedValue(
    //     exampleCurriculumAssessment
    //   );
    //   mockCreateNewSubmission.mockResolvedValue({
    //     id: exampleAssessmentSubmissionOpened.id,
    //   });
    //   mockGetSubmissionById.mockResolvedValue([exampleAssessmentSubmissionOpened]);
    //   mockPrincipalId(participantPrincipalId);
      
    //   appAgent
    //     .get(`/program/${exampleProgramAssessment.id}/submissions/new`)

    //     .expect(401, itemEnvelope(participantOpenedAssessmentSubmission), err => {
    //       expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockFindRoleInProgram).toHaveBeenCalledWith(
    //         participantPrincipalId,
    //         exampleProgramAssessment.program_id
    //       );
    //       expect(mockProgramAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.assessment_id,
    //         true,
    //         false
    //       );
    //       expect(mockCreateNewSubmission).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id,
    //         participantPrincipalId
    //       );
    //       expect(mockGetSubmissionById).toHaveBeenCalledWith(
    //         exampleAssessmentSubmissionOpened.id
    //       );
    //       done(err);
    //     });
    // });
    // it('should return a participant newly "Opened" submission without including the correct answers', done => {
    //   const participantOpenedAssessmentSubmission: SavedAssessment = {
    //     curriculum_assessment: exampleCurriculumAssessment,
    //     program_assessment: exampleProgramAssessment,
    //     submission: exampleAssessmentSubmissionOpened,
    //     principal_program_role: 'participant',
    //   };

    //   mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
    //     { program_id: exampleProgramAssessment.program_id },
    //   ]);
    //   mockFindRoleInProgram.mockResolvedValue({ title: 'Participant' });
    //   mockProgramAssessmentById.mockResolvedValue([exampleProgramAssessment]);
    //   mockGetCurriculumAssessmentById.mockResolvedValue(
    //     exampleCurriculumAssessment
    //   );
    //   mockCreateNewSubmission.mockResolvedValue({
    //     id: exampleAssessmentSubmissionOpened.id,
    //   });
    //   mockGetSubmissionById.mockResolvedValue([exampleAssessmentSubmissionOpened]);
    //   mockPrincipalId(participantPrincipalId);
      
    //   appAgent
    //     .get(`/program/${exampleProgramAssessment.id}/submissions/new`)

    //     .expect(200, itemEnvelope(participantOpenedAssessmentSubmission), err => {
    //       expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockFindRoleInProgram).toHaveBeenCalledWith(
    //         participantPrincipalId,
    //         exampleProgramAssessment.program_id
    //       );
    //       expect(mockProgramAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id
    //       );
    //       expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
    //         exampleProgramAssessment.assessment_id,
    //         true,
    //         false
    //       );
    //       expect(mockCreateNewSubmission).toHaveBeenCalledWith(
    //         exampleProgramAssessment.id,
    //         participantPrincipalId
    //       );
    //       expect(mockGetSubmissionById).toHaveBeenCalledWith(
    //         exampleAssessmentSubmissionOpened.id
    //       );
    //       done(err);
    //     });
    // });
  });

  describe('GET /submissions/:submissionId', () => {
    it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
      const facilitatorFullResponse: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Facilitator',
        submission: exampleAssessmentSubmissionSubmitted,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithCorrectAnswers
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(200, itemEnvelope(facilitatorFullResponse), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            exampleAssessmentSubmissionSubmitted.id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );

          expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.assessment_id,
            true,
            true
          );

          done(err);
        });
    });

    it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
      const participantInProgressAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionInProgress,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionInProgress
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionInProgress.id}`)
        .expect(
          200,
          itemEnvelope(participantInProgressAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionInProgress.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for an ungraded submitted assessment without including the correct answers', done => {
      const participantSubmittedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionSubmitted,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          200,
          itemEnvelope(participantSubmittedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant their submission information for a graded submitted assessment including the correct answers', done => {
      const participantGradedAssessmentSubmission: SavedAssessment = {
        curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
        program_assessment: exampleProgramAssessment,
        principal_program_role: 'Participant',
        submission: exampleAssessmentSubmissionGraded,
      };

      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionGraded
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithCorrectAnswers
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionGraded.id}`)
        .expect(
          200,
          itemEnvelope(participantGradedAssessmentSubmission),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionGraded.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with a BadRequestError if given an invalid submission ID', done => {
      const submissionId = 'test';

      appAgent
        .get(`/submissions/${submissionId}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(submissionId)}" is not a valid submission ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
      const submissionId = 8;
      mockGetAssessmentSubmission.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope(`Could not find submission with ID ${submissionId}.`),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              submissionId,
              true
            );

            done(err);
          }
        );
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the same as the principal id of the submission id and is not the principal id of the program facilitator', done => {
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${exampleAssessmentSubmissionSubmitted.id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );

            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });
    it('should respond with an Unauthorized Error if logged-in principal id is not enrolled in the program', done => {
      const programId = 1;
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          401,
          errorEnvelope(
            `Could not access submission with ID ${exampleAssessmentSubmissionSubmitted.id}.`
          ),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
            );
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              programId
            );
            done(err);
          }
        );
    });

    it('should respond with an internal server error if a database error occurs', done => {
      const submissionId = 10;
      mockGetAssessmentSubmission.mockRejectedValue(new Error());
      appAgent.get(`/submissions/${submissionId}`).expect(500, done);
    });
  });

  describe('PUT /submissions/:submissionId', () => {});
});
