import { Router } from 'express';

import { itemEnvelope } from './responseEnvelope';
import { findProgramWithActivities } from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res) => {
  const firstProgramId = 1;
  res.json(itemEnvelope(await findProgramWithActivities(firstProgramId)));
});

export default programsRouter;
