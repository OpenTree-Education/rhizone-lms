import { Router } from 'express';

import { collectionEnvelope } from './responseEnvelope';
import { listProgramsWithActivities } from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res) => {
  const programsWithActivities = await listProgramsWithActivities();
  res.json(
    collectionEnvelope(programsWithActivities, programsWithActivities.length)
  );
});

export default programsRouter;
