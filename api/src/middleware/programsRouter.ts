import { Router } from 'express';

import { itemEnvelope } from './responseEnvelope';
import { findProgramWithActivities } from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res, next) => {
  const firstProgramId = 1;
  try {
    res.json(itemEnvelope(await findProgramWithActivities(firstProgramId)));
  } catch (err) {
    next(err);
    return;
  }
});

export default programsRouter;
