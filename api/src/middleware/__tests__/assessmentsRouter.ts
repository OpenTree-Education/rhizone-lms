import { itemEnvelope, collectionEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
import {
  CurriculumAssessment,
  AssessmentSubmissionsSummary,
  FacilitatorAssessmentSubmissionsSummary,
  AssessmentSummary,
  ProgramAssessment,
} from '../../../src/models';
import {
  principalEnrolledPrograms,
  getAssessmentsForProgram,
  findRoleInProgram,
  getCurriculumAssessmentById,
  getProgramIdByProgramAssessmentId,
  getAssessmentSubmissions,
  getFacilitatorAssessmentSubmissionsSummary,
} from '../../services/assessmentService';

jest.mock('../../services/assessmentService');

const mockPrincipalEnrolledPrograms = jest.mocked(principalEnrolledPrograms);
const mockGetAssessmentsForProgram = jest.mocked(getAssessmentsForProgram);
const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockGetCurriculumAssessmentById = jest.mocked(
  getCurriculumAssessmentById
);
const mockGetAssessmentSubmissionsSummary = jest.mocked(
  getAssessmentSubmissions
);
const mockGetFacilitatorAssessmentSubmissionsSummary = jest.mocked(
  getFacilitatorAssessmentSubmissionsSummary
);

const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);

const programAssessmentId = 1;
const curriculumAssessmentId = 1;
const programId = 2;
const facilitatorId = 1;
const participantId = 2;
const curriculumAssessment: CurriculumAssessment = {
  id: curriculumAssessmentId,
  title: 'Assignment 1: React',
  description: 'Your assignment for week 1 learning.',
  max_score: 10,
  max_num_submissions: 3,
  time_limit: 120,
  curriculum_id: 3,
  activity_id: 97,
  principal_id: facilitatorId || participantId,
};

const programAssessment: ProgramAssessment = {
  id: programAssessmentId,
  program_id: 1,
  assessment_id: curriculumAssessmentId,
  available_after: '2023-02-06',
  due_date: '2023-02-10',
};

const assessmentSubmissionsSummary: AssessmentSubmissionsSummary = {
  principal_id: participantId,
  highest_state: 'Graded',
  most_recent_submitted_date: '2023-02-09 13:23:45',
  total_num_submissions: 1,
  highest_score: 10,
};

const facilitatorAssessmentSubmissionsSummary: FacilitatorAssessmentSubmissionsSummary =
  {
    num_participants_with_submissions: 6,
    num_program_participants: 12,
    num_ungraded_submissions: 2,
  };

const emptyAssessmentsSummaryList: AssessmentSummary[] = [];

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);
  const exampleAssessmentId = 1;
  const exampleSubmissionId = 1;

  describe('GET /', () => {
    const unenrolledPrincipalId = 4;
    const enrolledParticipantPrincipalId = 5;
    const facilitatorPrincipalId = 6;
    const programIds: number[] = [];

    it('should respond with an empty list for a user not enrolled in any programs', done => {
      // mock response from function that gets a list of programs the user is enrolled in to return an empty list
      mockPrincipalEnrolledPrograms.mockResolvedValue(programIds);

      appAgent
        .get('/')
        .expect(
          200,
          collectionEnvelope(emptyAssessmentsSummaryList, 0),
          err => {
            // call a (mock) function that gets a list of programs the user is enrolled in
            expect(mockPrincipalEnrolledPrograms).toHaveBeenCalledWith(
              unenrolledPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for participant enrolled in one program', done => {
      mockPrincipalId(enrolledParticipantPrincipalId);
      const participantAssessmentListResponse = [
        {
          curriculum_assessment: curriculumAssessment,
          program_assessment: programAssessment,
          submissions_summary: assessmentSubmissionsSummary,
        },
      ];

      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue([4]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with participant for that one program
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([
        exampleAssessmentId,
      ]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue(programAssessment);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      // mock responses from (call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program) to respond with the assessment summary for every program assessment that participant has submitted for previously
      mockGetAssessmentSubmissionsSummary.mockResolvedValue(
        assessmentSubmissionsSummary
      );
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
              enrolledParticipantPrincipalId
            );
            // call a function that returns the permission of the user for each program (participant/facilitator)
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              programId,
              enrolledParticipantPrincipalId
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              exampleAssessmentId,
              false,
              false
            );
            // call a (mock) function that gets the participant assessment summary for each program assessment where the user is a participant of that program
            expect(mockGetAssessmentsForProgram).toHaveBeenCalledWith(
              programId
            );
            expect(mockGetAssessmentSubmissionsSummary).toHaveBeenCalledWith(
              programAssessmentId,
              enrolledParticipantPrincipalId
            );
            done(err);
          }
        );
    });

    it('should respond with a list of all assessments (without questions) for facilitator of one program', done => {
      mockPrincipalId(facilitatorPrincipalId);
      const facilitatorAssessmentListResponse = [
        {
          curriculum_assessment: curriculumAssessment,
          program_assessment: programAssessment,
          submissions_summary: facilitatorAssessmentSubmissionsSummary,
        },
      ];
      // mock response from (function that gets a list of programs the user is enrolled in) to include one program
      mockPrincipalEnrolledPrograms.mockResolvedValue([4]);
      // mock response from (call a function that returns the permission of the user for each program (participant/facilitator)) to respond with facilitator for that one program
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([2]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'facilitator' });
      // mock response from (get a list of program assessments for each program the user is enrolled in) to respond with a list of program assessments
      mockGetAssessmentsForProgram.mockResolvedValue(programAssessment);
      // mock responses from (get a list of curriculum assessments that correspond to each program assessment) to respond with the corresponding curriculum assessment for each program assessment in that previous list
      mockGetCurriculumAssessmentById.mockResolvedValue(curriculumAssessment);
      // mock responses from (call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program) to respond with the assessment summary for all participants for each program assessment
      mockGetFacilitatorAssessmentSubmissionsSummary.mockResolvedValue(
        facilitatorAssessmentSubmissionsSummary
      );
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
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              programAssessmentId
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(
              programId,
              facilitatorPrincipalId
            );
            // get a list of curriculum assessments that correspond to each program assessment
            expect(mockGetCurriculumAssessmentById).toHaveBeenCalledWith(
              exampleAssessmentId,
              false,
              false
            );
            // call a (mock) function that gets the facilitator assessment summary for each program assessment where the user is a facilitator of that program
            expect(
              mockGetFacilitatorAssessmentSubmissionsSummary
            ).toHaveBeenCalledWith(programAssessmentId, facilitatorPrincipalId);
            done(err);
          }
        );
    });

    it('should respond with an error if an error occurs fetching information from the database', done => {
      // mock response from function that gets a list of programs the user is enrolled in to reject the database call
      mockPrincipalEnrolledPrograms.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });

  describe('POST /', () => {
    it('should create a new assessment', done => {
      const response = { behaviour: 'Creates a new assessment' };
      appAgent.post('/').expect(200, itemEnvelope(response), err => {
        done(err);
      });
    });
  });

  describe('GET /:assessmentId', () => {
    it('should show a single assessment', done => {
      const response = { behaviour: 'Shows a single assessment' };
      appAgent
        .get(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('PUT /:assessmentId', () => {
    it('should edit an assessment in the system', done => {
      const response = { behaviour: 'Edits an assessment in the system' };
      appAgent
        .put(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('DELETE /:assessmentId', () => {
    it('should delete an assessment in the system', done => {
      const response = { behaviour: '“Deletes” an assessment in the system' };
      appAgent
        .delete(`/${exampleAssessmentId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('GET /:assessmentId/submissions/:submissionId', () => {
    it('should return the submission information', done => {
      const response = {
        behaviour:
          'Returns the submission information (metadata, answers, etc)',
      };
      appAgent
        .get(`/${exampleAssessmentId}/submissions/${exampleSubmissionId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('PUT /:assessmentId/submissions/:submissionId', () => {
    it('should update the state of a submission', done => {
      const response = { behaviour: 'Updates the state of a submission' };
      appAgent
        .put(`/${exampleAssessmentId}/submissions/${exampleSubmissionId}`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });

  describe('GET /:assessmentId/submissions/new', () => {
    it('should create a new draft submission', done => {
      const response = { behaviour: 'Creates a new draft submission' };
      appAgent
        .get(`/${exampleAssessmentId}/submissions/new`)
        .expect(200, itemEnvelope(response), err => {
          done(err);
        });
    });
  });
});
