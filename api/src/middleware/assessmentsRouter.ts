import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import {listAssessments} from '../services/assessmentService'

const assessmentsRouter = Router();

assessmentsRouter.get('/', async (req, res, next) => {
  let assessments;
  try {
    assessments = await listAssessments();
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(assessments, assessments.length)
  );
});

assessmentsRouter.post('/', (req, res) => {
  const response = { behaviour: 'Creates a new assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:assessmentId', (req, res) => {
  const response = { behaviour: 'Shows a single assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.put('/:assessmentId', (req, res) => {
  const response = { behaviour: 'Edits an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.delete('/:assessmentId', (req, res) => {
  const response = { behaviour: '“Deletes” an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:assessmentId/submissions/new', (req, res) => {
  const response = { behaviour: 'Creates a new draft submission' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get(
  '/:assessmentId/submissions/:submissionId',
  (req, res) => {
    const response = {
      behaviour: 'Returns the submission information (metadata, answers, etc)',
    };
    res.status(200).json(itemEnvelope(response));
  }
);

assessmentsRouter.put(
  '/:assessmentId/submissions/:submissionId',
  (req, res) => {
    const response = { behaviour: 'Updates the state of a submission' };
    res.status(200).json(itemEnvelope(response));
  }
);

export default assessmentsRouter;
