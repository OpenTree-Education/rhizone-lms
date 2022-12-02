import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { NotFoundError } from './httpErrors';
import {
  listProgramsWithActivities,
  getParticipantActivityCompletion,
  setParticipantActivityCompletion,
} from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res) => {
  const programsWithActivities = await listProgramsWithActivities();
  res.json(
    collectionEnvelope(programsWithActivities, programsWithActivities.length)
  );
});

programsRouter.get(
  '/activityStatus/:programId/:activityId',
  async (req, res, next) => {
    const { programId, activityId } = req.params;
    const { principalId } = req.session;

    const programIdNum = Number(programId);
    const activityIdNum = Number(activityId);

    let activityCompletionStatus;

    try {
      activityCompletionStatus = await getParticipantActivityCompletion(
        principalId,
        programIdNum,
        activityIdNum
      );
    } catch (error) {
      next(error);
      return;
    }
    if (!activityCompletionStatus) {
      next(
        new NotFoundError(
          `A participant activity with the activity id "${activityIdNum}" could not be found.`
        )
      );
    }

    res.json(itemEnvelope(activityCompletionStatus));
  }
);

programsRouter.post(
  '/activityStatus/:programId/:activityId',
  async (req, res, next) => {
    const { programId, activityId } = req.params;
    const { completed } = req.body;
    const { principalId } = req.session;

    const programIdNum = Number(programId);
    const activityIdNum = Number(activityId);

    let updatedCompletionStatus;

    try {
      updatedCompletionStatus = await setParticipantActivityCompletion(
        principalId,
        programIdNum,
        activityIdNum,
        completed
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(updatedCompletionStatus));
  }
);

// future issue: grabbing participant activities upon render in order to enable color coding of event types in program calendar view
// specifically re: color coding completed assignment activities

export default programsRouter;
