import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { SavedAssessment } from '../../models';
import {
  exampleCurriculumAssessment,
  exampleCurriculumAssessmentWithQuestions,
  exampleCurriculumAssessmentWithCorrectAnswers,
  exampleProgramAssessment,
  exampleParticipantAssessmentSubmissionsSummary,
  exampleFacilitatorAssessmentSubmissionsSummary,
  exampleAssessmentSubmissionInProgress,
  exampleAssessmentSubmissionSubmitted,
  exampleAssessmentSubmissionGraded,
  administratorPrincipalId,
  participantPrincipalId,
  unenrolledPrincipalId,
  otherParticipantPrincipalId,
  facilitatorPrincipalId,
} from '../../assets/data';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import assessmentsRouter from '../assessmentsRouter';

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
      console.log(
        'exampleAssessmentSubmissionSubmitted',
        exampleAssessmentSubmissionSubmitted.id
      );

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(200, itemEnvelope(facilitatorFullResponse), err => {
          expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
            exampleAssessmentSubmissionSubmitted.id,
            true
          );

          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.assessment_id
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
              exampleProgramAssessment.assessment_id
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
        submission: exampleAssessmentSubmissionSubmitted,
        principal_program_role: 'Participant',
      };
      mockGetAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionSubmitted
      );

      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

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
              exampleProgramAssessment.assessment_id
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
        submission: exampleAssessmentSubmissionGraded,
        principal_program_role: 'participant',
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
              exampleProgramAssessment.assessment_id
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

    // it('should respond with a bad request error if given an invalid assessment id', done => {
    //   const programAssessmentId = 'test';
    //   appAgent
    //     .get(
    //       `/submissions/${exampleAssessmentSubmissionSubmitted.id}`
    //     )
    //     .expect(
    //       400,
    //       errorEnvelope(
    //         'The request could not be completed with the given parameters.'
    //       ),
    //       done
    //     );
    // });

    // it('should respond with a NotFoundError if the assessment id was not found in the database', done => {
    //   const programAssessmentId = 7;

    //   mockGetProgramIdByProgramAssessmentId.mockResolvedValue(null);
    //   appAgent
    //     .get(
    //       `/submissions/${exampleAssessmentSubmissionSubmitted.id}`
    //     )
    //     .expect(
    //       404,
    //       errorEnvelope('The requested resource does not exist.'),
    //       err => {
    //         expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
    //           programAssessmentId
    //         );
    //         done(err);
    //       }
    //     );
    // });

    it('should respond with a bad request error if given an invalid submission id ', done => {
      const submissionId = 'test';

      appAgent.get(`/submissions/${submissionId}`).expect(400, done);
      // .expect(400, errorEnvelope(
      //   'The request could not be completed with the given parameters.'
      // )  ,done);
    });

    it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
      const submissionId = 8;
      mockGetAssessmentSubmission.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/submissions/${submissionId}`)
        .expect(
          404,
          errorEnvelope('The requested resource does not exist.'),
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

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
        .expect(
          401,

          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
              exampleAssessmentSubmissionSubmitted.id,
              true
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
