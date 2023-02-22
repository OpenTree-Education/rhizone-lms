import { Router } from 'express';
import { itemEnvelope } from './responseEnvelope';

const assessmentsRouter = Router();
assessmentsRouter.get('/', (req, res) => {
  const response = { behaviour: 'list of assessments' };
  res.status(200).json(itemEnvelope(response));
});
export default assessmentsRouter;
