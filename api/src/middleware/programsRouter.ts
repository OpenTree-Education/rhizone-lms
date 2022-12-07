import { Router } from 'express';

import { collectionEnvelope } from './responseEnvelope';
import { listProgramsWithActivities } from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res, next) => {
  let programsWithActivities;
  try {
    programsWithActivities = await listProgramsWithActivities();
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(programsWithActivities, programsWithActivities.length)
  );
});

export default programsRouter;
