import { Router } from 'express';

import { collectionEnvelope } from './responseEnvelope';
import {
  findProgramWithActivities,
  listProgramsWithActivities,
} from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res) => {
  const firstProgramId = 1;
  const programsWithActivities = [
    await findProgramWithActivities(firstProgramId),
  ];
  res.json(collectionEnvelope(programsWithActivities, 1));
});

programsRouter.get('/test', async (req, res) => {
  const programsWithActivities = await listProgramsWithActivities();
  res.json(
    collectionEnvelope(programsWithActivities, programsWithActivities.length)
  );
});

export default programsRouter;
