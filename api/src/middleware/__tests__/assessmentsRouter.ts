import { createAppAgentForRouter } from '../routerTestUtils';

import assessmentsRouter from '../assessmentsRouter';

jest.mock('../../services/assessmentsService');

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

  describe('GET /program/:programAssessmentId/newSubmission', () => {});

  describe('GET /submissions/:submissionId', () => {});
  describe('PUT /submissions/:submissionId', () => {});
});
