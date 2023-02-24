import { Router } from 'express';
import { itemEnvelope } from './responseEnvelope';

const assessmentsRouter = Router();
assessmentsRouter.get('/', (req, res) => {
  const response = { behaviour: 'list of assessments' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.post('/', (req, res) => {
  const response = { behaviour: 'create new assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:id', (req, res) => {
  const response = { behaviour: 'view a single assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.put('/:id', (req, res) => {
  const response = { behaviour: 'Edits an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.delete('/:id', (req, res) => {
  const response = { behaviour: '“Deletes” an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:id/submissions/:id', (req, res) => {
  const response = {
    behaviour: 'Returns the submission information (metadata, answers, etc)',
  };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.put('/:id/submissions/:id', (req, res) => {
  const response = { behaviour: 'submits their answer for assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:id/submissions/new', (req, res) => {
  const response = { behaviour: 'creates a new draft submission' };
  res.status(200).json(itemEnvelope(response));
});

export default assessmentsRouter;
