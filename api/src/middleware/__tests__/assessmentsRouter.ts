import { itemEnvelope, errorEnvelope, collectionEnvelope } from '../responseEnvelope';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';

import assessmentsRouter from '../assessmentsRouter';

import { constructFacilitatorAssessmentSummary, constructParticipantAssessmentSummary, createAssessment, createAssessmentSubmission, deleteCurriculumAssessment, deleteProgramAssessment, findProgramAssessment, getAssessmentSubmission, getCurriculumAssessment, getPrincipalProgramRole, listParticipantProgramAssessmentSubmissions, listPrincipalEnrolledProgramIds, listProgramAssessments, updateAssessment, updateAssessmentSubmission } from '../../services/assessmentsService';

jest.mock('../../services/assessmentsService');

const mockConstructFacilitatorAssessmentSummary = jest.mocked(constructFacilitatorAssessmentSummary);
const mockConstructParticipantAssessmentSummary = jest.mocked(constructParticipantAssessmentSummary);
const mockCreateAssessment = jest.mocked(createAssessment);
const mockCreateAssessmentSubmission = jest.mocked(createAssessmentSubmission);
const mockDeleteCurriculumAssessment = jest.mocked(deleteCurriculumAssessment);
const mockDeleteProgramAssessment = jest.mocked(deleteProgramAssessment);
const mockFindProgramAssessment = jest.mocked(findProgramAssessment);
const mockGetAssessmentSubmission = jest.mocked(getAssessmentSubmission);
const mockGetCurriculumAssessment = jest.mocked(getCurriculumAssessment);
const mockGetPrincipalProgramRole = jest.mocked(getPrincipalProgramRole);
const mockListParticipantProgramAssessmentSubmissions = jest.mocked(listParticipantProgramAssessmentSubmissions);
const mockListPrincipalEnrolledProgramIds = jest.mocked(listPrincipalEnrolledProgramIds);
const mockListProgramAssessments = jest.mocked(listProgramAssessments);
const mockUpdateAssessment = jest.mocked(updateAssessment);
const mockUpdateAssessmentSubmission = jest.mocked(updateAssessmentSubmission);

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
