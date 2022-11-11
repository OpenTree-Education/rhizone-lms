import { Router } from 'express';

import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { listPrograms, listCurriculumActivities } from '../services/programsService';
import { parsePaginationParams } from './paginationParamsMiddleware';

const programsRouter = Router();

programsRouter.get('/', parsePaginationParams(), async (req, res, next) => {
  const { limit, offset } = req.pagination;
  let allPrograms;
  try {
    allPrograms = await listPrograms();
    const programActivities = await listCurriculumActivities(allPrograms[0].id);
    allPrograms[0].activities = programActivities;
    // allPrograms.forEach(async (program) => {
    //   const programActivities = await listCurriculumActivities(program.id);
    //   program.activities = programActivities;
    // });
  } catch (err) {
    next(err);
    return;
  }
  if (allPrograms && allPrograms.length) {
    res.json(collectionEnvelope(allPrograms, allPrograms.length));
  } else {
    res.json(collectionEnvelope(null, 0));
  }
});

export default programsRouter;
