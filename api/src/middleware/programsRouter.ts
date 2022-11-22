import { Router } from 'express';

import { collectionEnvelope } from './responseEnvelope';
import { findProgramWithActivities } from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res) => {
  const firstProgramId = 1;
  const programsWithActivities = [
    await findProgramWithActivities(firstProgramId),
  ];
  res.json(collectionEnvelope(programsWithActivities, 1));
});

export default programsRouter;
