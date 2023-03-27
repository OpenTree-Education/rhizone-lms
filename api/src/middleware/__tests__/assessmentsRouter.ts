import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
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
  unenrolledPrincipalId,
  exampleParticipantAssessmentSubmissionsSummary,
  exampleFacilitatorAssessmentSubmissionsSummary,
  exampleCurriculumAssessment
} from '../../assets/data';
import { AssessmentWithSummary, SavedAssessment } from '../../models';

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
      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with participant for that one program
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockListProgramAssessments.mockResolvedValue(
        [exampleProgramAssessment]
      );
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      // mock responses from (call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program) to respond with the assessment summary for every program assessment that participant has submitted for previously
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
            // call a (mock) function that gets a list of programs the user is enrolled in
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              participantPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockListProgramAssessments).toHaveBeenCalledWith(
              exampleProgramAssessment.program_id
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program
            expect(
              mockConstructParticipantAssessmentSummary
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
      mockListPrincipalEnrolledProgramIds.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with facilitator for that one program
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockListProgramAssessments.mockResolvedValue([
        exampleProgramAssessment,
      ]);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );
      // mock responses from (call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program) to respond with the assessment summary for all participants for each program assessment
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
            // call a (mock) function that gets a list of programs the user is facilitating
            expect(mockListPrincipalEnrolledProgramIds).toHaveBeenCalledWith(
              facilitatorPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );
            //get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
            expect(mockListProgramAssessments).toBeCalledWith(
              exampleProgramAssessment.program_id
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );
            // call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program
            expect(
              mockConstructFacilitatorAssessmentSummary
            ).toHaveBeenCalledWith(exampleProgramAssessment.assessment_id, exampleProgramAssessment.program_id
);
            done(err);
          }
        );
    });




  });

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

  // describe('GET /submissions/:submissionId', () => {
  //   it("should show a facilitator the full submission information for a participant's ungraded submitted assessment, including the correct answers", done => {
  //     const facilitatorFullResponse: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithCorrectAnswers,
  //       program_assessment: exampleProgramAssessment,
  //       principal_program_role: 'Facilitator',
  //       submission: exampleAssessmentSubmissionSubmitted,
  //     };

  //     mockGetAssessmentSubmission.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
  //     mockGetCurriculumAssessment.mockResolvedValue(
  //       exampleCurriculumAssessmentWithCorrectAnswers
  //     );

  //     mockPrincipalId(facilitatorPrincipalId);

  //     appAgent
  //       .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
  //       .expect(200, itemEnvelope(facilitatorFullResponse), err => {
  //         expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //           exampleAssessmentSubmissionSubmitted.id,
  //           true
  //         );

  //         expect(mockFindProgramAssessment).toHaveBeenCalledWith(
  //           exampleProgramAssessment.id
  //         );

  //         expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
  //           facilitatorPrincipalId,
  //           exampleProgramAssessment.program_id
  //         );

  //         expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
  //           exampleProgramAssessment.assessment_id,
  //           true,
  //           true
  //         );

  //         done(err);
  //       });
  //   });

  //   it('should show a participant their submission information for an in-progress assessment without including the correct answers', done => {
  //     const participantInProgressAssessmentSubmission: SavedAssessment = {
  //       curriculum_assessment: exampleCurriculumAssessmentWithQuestions,
  //       program_assessment: exampleProgramAssessment,
  //       principal_program_role: 'Participant',
  //       submission: exampleAssessmentSubmissionInProgress,
  //     };

  //     mockGetAssessmentSubmission.mockResolvedValue(
  //       exampleAssessmentSubmissionInProgress
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Participant');
  //     mockGetCurriculumAssessment.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(`/submissions/${exampleAssessmentSubmissionInProgress.id}`)
  //       .expect(
  //         200,
  //         itemEnvelope(participantInProgressAssessmentSubmission),
  //         err => {
  //           expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionInProgress.id,
  //             true
  //           );

  //           expect(mockFindProgramAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );

  //           expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );

  //           expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
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

  //     mockGetAssessmentSubmission.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Participant');
  //     mockGetCurriculumAssessment.mockResolvedValue(
  //       exampleCurriculumAssessmentWithQuestions
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Participant');

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
  //       .expect(
  //         200,
  //         itemEnvelope(participantSubmittedAssessmentSubmission),
  //         err => {
  //           expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionSubmitted.id,
  //             true
  //           );

  //           expect(mockFindProgramAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );

  //           expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );

  //           expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             false
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
  //       principal_program_role: 'Participant',
  //     };

  //     mockGetAssessmentSubmission.mockResolvedValue(
  //       exampleAssessmentSubmissionGraded
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Participant');
  //     mockGetCurriculumAssessment.mockResolvedValue(
  //       exampleCurriculumAssessmentWithCorrectAnswers
  //     );

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(`/submissions/${exampleAssessmentSubmissionGraded.id}`)
  //       .expect(
  //         200,
  //         itemEnvelope(participantGradedAssessmentSubmission),
  //         err => {
  //           expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionGraded.id,
  //             true
  //           );

  //           expect(mockFindProgramAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );

  //           expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
  //             participantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );

  //           expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.assessment_id,
  //             true,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with a BadRequestError if given an invalid submission ID', done => {
  //     const submissionId = 'test';

  //     appAgent
  //       .get(`/submissions/${submissionId}`)
  //       .expect(
  //         400,
  //         errorEnvelope(
  //           `"${Number(submissionId)}" is not a valid submission ID.`
  //         ),
  //         done
  //       );
  //   });

  //   it('should respond with a NotFoundError if the submission id was not found in the database ', done => {
  //     const submissionId = 8;
  //     mockGetAssessmentSubmission.mockResolvedValue(null);

  //     mockPrincipalId(participantPrincipalId);

  //     appAgent
  //       .get(`/submissions/${submissionId}`)
  //       .expect(
  //         404,
  //         errorEnvelope(`Could not find submission with ID ${submissionId}.`),
  //         err => {
  //           expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //             submissionId,
  //             true
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with an Unauthorized Error if the logged-in principal id is not the same as the principal id of the submission id and is not the principal id of the program facilitator', done => {
  //     mockGetAssessmentSubmission.mockResolvedValue(
  //       exampleAssessmentSubmissionSubmitted
  //     );
  //     mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
  //     mockGetPrincipalProgramRole.mockResolvedValue('Participant');

  //     mockPrincipalId(otherParticipantPrincipalId);

  //     appAgent
  //       .get(`/submissions/${exampleAssessmentSubmissionSubmitted.id}`)
  //       .set('Accept', 'application/json')
  //       .expect(
  //         401,
  //         errorEnvelope(
  //           `Could not access submission with ID ${exampleAssessmentSubmissionSubmitted.id}.`
  //         ),
  //         err => {
  //           expect(mockGetAssessmentSubmission).toHaveBeenCalledWith(
  //             exampleAssessmentSubmissionSubmitted.id,
  //             true
  //           );

  //           expect(mockFindProgramAssessment).toHaveBeenCalledWith(
  //             exampleProgramAssessment.id
  //           );

  //           expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
  //             otherParticipantPrincipalId,
  //             exampleProgramAssessment.program_id
  //           );

  //           done(err);
  //         }
  //       );
  //   });

  //   it('should respond with an internal server error if a database error occurs', done => {
  //     const submissionId = 10;
  //     mockGetAssessmentSubmission.mockRejectedValue(new Error());
  //     appAgent.get(`/submissions/${submissionId}`).expect(500, done);
  //   });
  // });
  describe('PUT /submissions/:submissionId', () => {});
});
