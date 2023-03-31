import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import { AssessmentWithSummary, SavedAssessment } from '../../models';
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
  updatedProgramAssessmentsRow,
  unenrolledPrincipalId,
  exampleParticipantAssessmentSubmissionsSummary,
  exampleFacilitatorAssessmentSubmissionsSummary,
  exampleAssessmentDetails,
  updatedCurriculumAssessment,
  newCurriculumAssessment,
  // updatedCurriculumAssessmentsRow,
  exampleOtherAssessmentSubmissionSubmitted,
  exampleParticipantAssessmentWithSubmissions,
  exampleFacilitatorAssessmentWithSubmissions,
  matchingAssessmentSubmissionOpenedRow,
  matchingOtherAssessmentSubmissionSubmittedRow,
  exampleParticipantOpenedSavedAssessment,
  exampleAssessmentSubmissionOpened,
  exampleProgramAssessmentsRow,
} from '../../assets/data';
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
const mockFacilitatorProgramIdsMatchingCurriculum = jest.mocked(
  facilitatorProgramIdsMatchingCurriculum
);
const mockListAllProgramAssessmentSubmissions = jest.mocked(
  listAllProgramAssessmentSubmissions
);
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
    it('should retrieve a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([
        exampleProgramAssessment.program_id,
      ]);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/${exampleCurriculumAssessmentWithCorrectAnswers.id}`)
        .expect(
          200,
          itemEnvelope(exampleCurriculumAssessmentWithCorrectAnswers),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithCorrectAnswers.id,
              true,
              true
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleCurriculumAssessmentWithCorrectAnswers.curriculum_id
            );

            done(err);
          }
        );
    });

    it('should respond with an UnauthorizedError if the logged-in principal ID is not the program facilitator', done => {
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithCorrectAnswers
      );
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/curriculum/${exampleCurriculumAssessmentWithCorrectAnswers.id}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access curriculum assessment with ID ${exampleCurriculumAssessmentWithCorrectAnswers.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithCorrectAnswers.id,
              true,
              true
            );
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleCurriculumAssessmentWithCorrectAnswers.curriculum_id
            );

            done(err);
          }
        );
    });

    it('should respond with an BadRequestError if the curriculum assessment ID is not a number.', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/test`)
        .expect(
          400,
          errorEnvelope(`"${Number(test)}" is not a valid submission ID.`),
          err => {
            done(err);
          }
        );
    });

    it('should respond with a NotFoundError if the curriculum assessment ID was not found in the database', done => {
      mockGetCurriculumAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/curriculum/${exampleCurriculumAssessmentWithCorrectAnswers.id}`)
        .expect(
          404,
          errorEnvelope(
            `Could not find curriculum assessment with ID ${exampleCurriculumAssessmentWithCorrectAnswers.id}.`
          ),
          err => {
            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleCurriculumAssessmentWithCorrectAnswers.id,
              true,
              true
            );

            done(err);
          }
        );
    });
  });

  describe('POST /curriculum', () => {
    it('should create a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
      const matchingFacilitatorPrograms = [3, 4, 6];
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue(
        matchingFacilitatorPrograms
      );
      mockCreateCurriculumAssessment.mockResolvedValue(
        updatedCurriculumAssessment
      );
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(newCurriculumAssessment)
        .expect(201, err => {
          expect(
            mockFacilitatorProgramIdsMatchingCurriculum
          ).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            newCurriculumAssessment.curriculum_id
          );
          expect(mockCreateCurriculumAssessment).toHaveBeenCalledWith(
            newCurriculumAssessment
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([]);
      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send(newCurriculumAssessment)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to add a new assessment for this curriculum.`
          ),
          err => {
            expect(
              mockFacilitatorProgramIdsMatchingCurriculum
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              newCurriculumAssessment.curriculum_id
            );
            done(err);
          }
        );
    });
    it('should reponse with BadRequestError if the information missing', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/curriculum`)
        .send({ description: 'test' })
        .expect(
          422,
          errorEnvelope(`Was not given a valid curriculum assessment.`),
          err => {
            done(err);
          }
        );
    });
  });

  // describe('PUT /curriculum/:curriculumAssessmentId', () => {
  //   it('should update a curriculum assessment if the logged-in principal ID is the program facilitator', done => {
  //     const matchingFacilitatorPrograms=2;
  //     mockFacilitatorProgramIdsMatchingCurriculum.mockResolvedValue([matchingFacilitatorPrograms]);
  //     mockGetCurriculumAssessment.mockResolvedValue(exampleCurriculumAssessmentWithCorrectAnswers);
  //     mockUpdateCurriculumAssessment.mockResolvedValue(updatedCurriculumAssessmentsRow);

  //     mockPrincipalId(facilitatorPrincipalId);

  //     appAgent
  //       .put(`/curriculum/${exampleCurriculumAssessment.id}`)
  //       .send(updatedCurriculumAssessmentsRow)
  //       .expect(201, err => {
  //         expect(mockFacilitatorProgramIdsMatchingCurriculum).toHaveBeenCalledWith(
  //           facilitatorPrincipalId, exampleCurriculumAssessment.id
  //         );

  //         expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
  //           exampleCurriculumAssessment.id,
  //           true,
  //           true
  //         );

  //         expect(mockUpdateCurriculumAssessment).toHaveBeenCalledWith(
  //           updatedProgramAssessmentsRow
  //         );

  //         done(err);
  //       });
  //   });

  // });
  describe('DELETE /curriculum/:curriculumAssessmentId', () => {});

  describe('GET /program/:programAssessmentId', () => {});
  describe('POST /program', () => {
    it('should update a program assessment if the logged-in principal ID is the program facilitator', done => {
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockCreateProgramAssessment.mockResolvedValue(
        updatedProgramAssessmentsRow
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/program`)
        .send(exampleProgramAssessmentsRow)
        .expect(201, err => {
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessmentsRow.program_id
          );

          expect(mockCreateProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessmentsRow
          );

          done(err);
        });
    });

    it('should respond with an Unauthorized Error if the logged-in principal id is not the facilitator', done => {
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);

      appAgent
        .post(`/program`)
        .send(exampleProgramAssessmentsRow)
        .expect(
          401,
          errorEnvelope(
            `User is not allowed to create new program assessments for this program.`
          ),
          err => {
            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessmentsRow.program_id
            );

            done(err);
          }
        );
    });

    it('should reponse with BadRequestError if the information missing', done => {
      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .post(`/program`)
        .send({ available_after: '2023-08-10' })
        .expect(
          400,
          errorEnvelope(`Was not given a valid program assessment.`),
          err => {
            done(err);
          }
        );
    });
  });

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
  describe('DELETE /program/:programAssessmentId', () => {
    it('should delete a program assessment in the system if logged-in user is facilitator of that program', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockDeleteProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(facilitatorPrincipalId);
      appAgent
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(204, {}, err => {
          expect(mockFindProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );
          expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
            facilitatorPrincipalId,
            exampleProgramAssessment.program_id
          );
          expect(mockDeleteProgramAssessment).toHaveBeenCalledWith(
            exampleProgramAssessment.id
          );
          done(err);
        });
    });

    it('should return an error if logged-in user is not a facilitator of that program', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');

      mockPrincipalId(participantPrincipalId);
      appAgent
        .delete(`/program/${exampleProgramAssessment.id}`)
        .expect(
          401,
          errorEnvelope(
            `Not allowed to access program assessment with ID ${exampleProgramAssessment.id}.`
          ),
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

    it('should respond with a BadRequestError if given an invalid program assessment ID', done => {
      const programAssessmentId = 'test';

      appAgent
        .delete(`/program/${programAssessmentId}`)
        .expect(
          400,
          errorEnvelope(
            `"${Number(
              programAssessmentId
            )}" is not a valid program assessment ID.`
          ),
          done
        );
    });
  });

  describe('GET /program/:programAssessmentId/submissions', () => {
    it('should show a facilitator an AssessmentWithSubmissions with all participant submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');
      mockListAllProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionInProgress,
        exampleOtherAssessmentSubmissionSubmitted,
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          200,
          itemEnvelope(exampleFacilitatorAssessmentWithSubmissions),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(
              mockListAllProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(exampleProgramAssessment.id);

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );

            done(err);
          }
        );
    });

    it('should show a participant an AssessmentWithSubmissions with their submissions', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionInProgress,
      ]);
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessment
      );

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          200,
          itemEnvelope(exampleParticipantAssessmentWithSubmissions),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              false,
              false
            );

            done(err);
          }
        );
    });

    it('should give an UnauthorizedError to anyone not enrolled in the course', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${exampleProgramAssessment.id} without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should give a NotFoundError for a programAssessmentId not found in the database', done => {
      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${exampleProgramAssessment.id}`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });

    it('should give a BadRequestError for an invalid programAssessmentId', done => {
      mockPrincipalId(participantPrincipalId);
      appAgent
        .get(`/program/test/submissions`)
        .expect(
          400,
          errorEnvelope(`"test" is not a valid program assessment ID.`),
          err => {
            done(err);
          }
        );
    });
  });

  describe('GET /program/:programAssessmentId/submissions/new', () => {
    it('should respond with a bad request error if given an invalid assessment id', done => {
      const programAssessmentInvalidId = 'test';
      appAgent
        .get(`/program/${programAssessmentInvalidId}/submissions/new`)
        .expect(
          400,
          errorEnvelope(
            `"${programAssessmentInvalidId}" is not a valid program assessment ID.`
          ),
          done
        );
    });

    it('should respond with a NotFoundError if the assessment submission ID was not found in the database', done => {
      mockFindProgramAssessment.mockResolvedValue(null);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          404,
          errorEnvelope(
            `Could not find program assessment with ID ${exampleProgramAssessment.id}.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission for a program assessment that is not yet available', done => {
      mockFindProgramAssessment.mockResolvedValue(
        exampleProgramAssessmentNotAvailable
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(
          `/program/${exampleProgramAssessmentNotAvailable.id}/submissions/new`
        )
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment that's not yet available.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentNotAvailable.id
            );
            done(err);
          }
        );
    });

    it('should return an error when attempting to create a submission when the program assessment due date has passed', done => {
      mockFindProgramAssessment.mockResolvedValue(
        exampleProgramAssessmentPastDue
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessmentPastDue.id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission of an assessment after its due date.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessmentPastDue.id
            );
            done(err);
          }
        );
    });

    it('should return an error if logged-in user is not enrolled in the program', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue(null);

      mockPrincipalId(unenrolledPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Could not access program assessment with ID ${exampleProgramAssessment.id}) without enrollment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              unenrolledPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });

    it('should return an error if logged-in user is a facilitator', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Facilitator');

      mockPrincipalId(facilitatorPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          401,
          errorEnvelope(
            `Facilitators are not allowed to create program assessment submissions.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              facilitatorPrincipalId,
              exampleProgramAssessment.program_id
            );

            done(err);
          }
        );
    });
    it('should return an error if no possible submissions remain for this participant and this assessment', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        matchingOtherAssessmentSubmissionSubmittedRow,
      ]);

      mockPrincipalId(otherParticipantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          403,
          errorEnvelope(
            `Could not create a new submission as you have reached the maximum number of submissions for this assessment.`
          ),
          err => {
            expect(mockFindProgramAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.id
            );

            expect(mockGetPrincipalProgramRole).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.program_id
            );

            expect(mockGetCurriculumAssessment).toHaveBeenCalledWith(
              exampleProgramAssessment.assessment_id,
              true,
              false
            );

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              otherParticipantPrincipalId,
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });
    it('should return the existing submission if one is currently opened or in progress', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue([
        exampleAssessmentSubmissionOpened,
      ]);

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(exampleParticipantOpenedSavedAssessment),
          err => {
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

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });

    it('should return a participant a new submission without including the correct answers', done => {
      mockFindProgramAssessment.mockResolvedValue(exampleProgramAssessment);
      mockGetPrincipalProgramRole.mockResolvedValue('Participant');
      mockGetCurriculumAssessment.mockResolvedValue(
        exampleCurriculumAssessmentWithQuestions
      );
      mockListParticipantProgramAssessmentSubmissions.mockResolvedValue(null);
      mockCreateAssessmentSubmission.mockResolvedValue(
        exampleAssessmentSubmissionOpened
      );

      mockPrincipalId(participantPrincipalId);

      appAgent
        .get(`/program/${exampleProgramAssessment.id}/submissions/new`)
        .expect(
          200,
          itemEnvelope(exampleParticipantOpenedSavedAssessment),
          err => {
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

            expect(
              mockListParticipantProgramAssessmentSubmissions
            ).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            expect(mockCreateAssessmentSubmission).toHaveBeenCalledWith(
              participantPrincipalId,
              exampleProgramAssessment.id
            );

            done(err);
          }
        );
    });
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
  //reference

  describe('PUT /submissions/:submissionId', () => {});

  describe('PUT /submissions/:submissionId', () => {});
});
