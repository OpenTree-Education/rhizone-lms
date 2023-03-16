import { itemEnvelope, errorEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import assessmentsRouter from '../assessmentsRouter';
jest.mock('../../services/assessmentService.ts');

import {
  findRoleInProgram,
  getProgramIdByProgramAssessmentId,
  deleteAssessmentById,
} from '../../services/assessmentService';

const mockFindRoleInProgram = jest.mocked(findRoleInProgram);
const mockGetProgramIdByProgramAssessmentId = jest.mocked(
  getProgramIdByProgramAssessmentId
);
const mockDeleteAssessmentById = jest.mocked(deleteAssessmentById);

describe('assessmentsRouter', () => {
  const appAgent = createAppAgentForRouter(assessmentsRouter);
  const exampleAssessmentId = 1;
  const exampleSubmissionId = 1;

  describe('GET /', () => {
    it('should respond with a list of all assessments', done => {
      const response = { behaviour: 'Shows a list of all assessments' };
      appAgent.get('/').expect(200, itemEnvelope(response), err => {
        done(err);
      });
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
    it('should delete a program assessment in the system if logged-in user is facilitator of that program', done => {
      const principalId = 3;
      const assessmentId = 1;
      mockPrincipalId(principalId);
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([2]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'facilitator' });
      appAgent.delete(`/${assessmentId}`).expect(204, null, err => {
        expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(1);
        expect(mockFindRoleInProgram).toHaveBeenCalledWith(principalId, 2);
        expect(mockDeleteAssessmentById).toHaveBeenCalledWith(1);
        done(err);
      });
    });
    it('should return an error if logged-in user is not a facilitator of that program', done => {
      const principalId = 4;
      const assessmentId = 1;
      mockPrincipalId(principalId);
      mockGetProgramIdByProgramAssessmentId.mockResolvedValue([2]);
      mockFindRoleInProgram.mockResolvedValue({ title: 'participant' });
      appAgent
        .delete(`/${assessmentId}`)
        .expect(
          401,
          errorEnvelope('The requester does not have access to the resource.'),
          err => {
            expect(mockGetProgramIdByProgramAssessmentId).toHaveBeenCalledWith(
              1
            );
            expect(mockFindRoleInProgram).toHaveBeenCalledWith(principalId, 2);
            done(err);
          }
        );
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
