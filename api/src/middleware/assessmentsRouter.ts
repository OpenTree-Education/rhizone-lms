import { Router } from 'express';

const assessmentsRouter = Router();

// List all AssessmentWithSummary to which the user has access
assessmentsRouter.get('/', async (req, res, next) => { res.json() });

// Get details of a specific CurriculumAssessment
assessmentsRouter.get('/curriculum/:curriculumAssessmentId', async (req, res, next) => { res.json() });
// Create a new CurriculumAssessment
assessmentsRouter.post('/curriculum', async (req, res, next) => { res.json() });
// Update an existing CurriculumAssessment
assessmentsRouter.put('/curriculum/:curriculumAssessmentId', async (req, res, next) => { res.json() });
// Delete an existing CurriculumAssessment
assessmentsRouter.delete('/curriculum/:curriculumAssessmentId', async (req, res, next) => { res.json() });

// Get details of a specific AssessmentWithSubmissions
assessmentsRouter.get('/program/:programAssessmentId', async (req, res, next) => { res.json() });
// Create a new ProgramAssessment
assessmentsRouter.post('/program', async (req, res, next) => { res.json() });
// Update an existing ProgramAssessment
assessmentsRouter.put('/program/:programAssessmentId', async (req, res, next) => { res.json() });
// Delete an existing ProgramAssessment
assessmentsRouter.delete('/program/:programAssessmentId', async (req, res, next) => { res.json() });

// Start a new AssessmentSubmission
assessmentsRouter.get('/program/:programAssessmentId/newSubmission', (req, res, next) => { res.json() });

// Get details of a specific AssessmentSubmission
assessmentsRouter.get('/submissions/:submissionId', (req, res, next) => { res.json() });
// Update details of a specific AssessmentSubmission
assessmentsRouter.put('/submissions/:submissionId', (req, res, next) => { res.json() });

export default assessmentsRouter;
