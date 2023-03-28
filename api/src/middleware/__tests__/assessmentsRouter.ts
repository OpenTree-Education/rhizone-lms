import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import { AssessmentWithSummary, SavedAssessment } from '../../models';
import {
  exampleCurriculumAssessmentWithCorrectAnswers,
  exampleProgramAssessment,
  exampleAssessmentSubmissionSubmitted,
  facilitatorPrincipalId,
  exampleCurriculumAssessmentWithQuestions,
  exampleAssessmentSubmissionInProgress,
  participantPrincipalId,
  exampleAssessmentSubmissionGraded,
  otherParticipantPrincipalId,
  updatedProgramAssessmentsRow,
  unenrolledPrincipalId,
  exampleParticipantAssessmentSubmissionsSummary,
  exampleFacilitatorAssessmentSubmissionsSummary,
  exampleCurriculumAssessment,
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

  describe('GET /', () => {
    it('should respond with an empty list for a user not enrolled in any programs', done => {
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([]);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent.get('/').expect(200, collectionEnvelope([], 0), err => {
        expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
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
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListProgramAssessments.mockResolvedValue([exampleProgramAssessment]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      mockConstructParticipantAssessmentSummary.mockResolvedValue(
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
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              participantPrincipalId
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            expect(mockListProgramAssessments).toHaveBeenCalledWith(
              exampleProgramAssessment.program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            expect(
              mockConstructParticipantAssessmentSummary
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.assessment_id
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

      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListProgramAssessments.mockResolvedValue([exampleProgramAssessment]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      mockConstructFacilitatorAssessmentSummary.mockResolvedValue(
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
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              facilitatorPrincipalId
            );
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );
            expect(mockListProgramAssessments).toBeCalledWith(
              exampleProgramAssessment.program_id
            );
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            expect(
              mockConstructFacilitatorAssessmentSummary
            ).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              exampleProgramAssessment.program_id
            );
            done(err);
          }
        );
    });

    it('should throw an error if a database error was encountered', done => {
      mockListPrincipalEnrolledProgramIds.mockRejectedValue(new Error());

      mockPrincipalId(facilitatorPrincipalId);

      appAgent.get('/').expect(500, done);
    });
  });

  describe('GET /curriculum/:curriculumAssessmentId', () => {
    //code here
  });
  describe('POST /curriculum', () => {});
  describe('PUT /curriculum/:curriculumAssessmentId', () => {});
  describe('DELETE /curriculum/:curriculumAssessmentId', () => {});

  describe('GET /program/:programAssessmentId', () => {});
  describe('POST /program', () => {});
  describe('PUT /program/:programAssessmentId', () => {
    it('should update a program assessment if the logged-in principal ID is the program facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockUpdateProgramAssessment.mockResolvedValue(
        updatedProgramAssessmentsRow
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(updatedProgramAssessmentsRow)
        .expect(201, err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );

          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );

          expect(mockUpdateProgramAssessment).toHaveBeenCalledWith(
            updatedProgramAssessmentsRow
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(updatedProgramAssessmentsRow)
        .expect(
          401,
          errorEnvelope(
            `Could not access program Assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
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

    it('should respond with an BadRequestError if the program assessment ID is not a number.', done => {
      const exampleAssessmentFromUser = 'test';

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${exampleAssessmentFromUser}`)
        .send(exampleProgramAssessment)
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              exampleAssessmentFromUser
            )}" is not a valid program assessment ID.`
          ),
          done
        );
    });

    it('should respond with an BadRequestError if the Was not given a valid program assessment.', done => {
      const exampleAssessmentFormUser = 'test';

      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .put(`/program/${exampleProgramAssessment.id}`)
        .send(exampleAssessmentFormUser)
        .expect(
          400,
          errorEnvelope(`Was not given a valid program assessment.`),
          err => {
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

    it('should respond with a NotFoundError if the program assessment ID was not found in the database', done => {
      const programAssessmentId = 20;

      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .put(`/program/${programAssessmentId}`)
        .send(updatedProgramAssessmentsRow)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${programAssessmentId}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              programAssessmentId
            );

            done(err);
          }
        );
    });
  });
  describe('DELETE /program/:programAssessmentId', () => {});

  describe('GET /program/:programAssessmentId/submissions', () => {});
  describe('GET /program/:programAssessmentId/submissions/new', () => {});

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
  //reference

  describe('PUT /submissions/:submissionId', () => {});

  describe('PUT /submissions/:submissionId', () => {});
});
