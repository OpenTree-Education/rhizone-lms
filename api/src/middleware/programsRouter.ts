import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { BadRequestError } from './httpErrors';
import {
  listProgramsWithActivities,
  getParticipantActivityCompletion,
  setParticipantActivityCompletion,
  listParticipantActivitiesCompletionForProgram,
} from '../services/programsService';

const programsRouter = Router();

programsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  let programsWithActivities;
  try {
    programsWithActivities = await listProgramsWithActivities(principalId);
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(programsWithActivities, programsWithActivities.length)
  );
});

programsRouter.get('/activityStatus/:programId', async (req, res, next) => {
  const { programId } = req.params;
  const { principalId } = req.session;

  const programIdNum = Number(programId);

  if (!Number.isInteger(programIdNum) || programIdNum < 1) {
    next(new BadRequestError(`"${programIdNum}" is not a valid program id.`));
    return;
  }

  let participantActivitiesList;

  try {
    participantActivitiesList =
      await listParticipantActivitiesCompletionForProgram(
        principalId,
        programIdNum
      );
  } catch (error) {
    next(error);
    return;
  }
  res.json(itemEnvelope(participantActivitiesList));
});

programsRouter.get(
  '/activityStatus/:programId/:activityId',
  async (req, res, next) => {
    const { programId, activityId } = req.params;
    const { principalId } = req.session;

    const programIdNum = Number(programId);
    const activityIdNum = Number(activityId);

    if (!Number.isInteger(programIdNum) || programIdNum < 1) {
      next(new BadRequestError(`"${programIdNum}" is not a valid program id.`));
      return;
    }

    if (!Number.isInteger(activityIdNum) || activityIdNum < 1) {
      next(new BadRequestError(`"${activityId}" is not a valid activity id.`));
      return;
    }

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

    res.json(
      itemEnvelope({
        programId: programIdNum,
        activityId: activityIdNum,
        completed: activityCompletionStatus.completed,
      })
    );
  }
);

programsRouter.put(
  '/activityStatus/:programId/:activityId',
  async (req, res, next) => {
    const { programId, activityId } = req.params;
    const { completed } = req.body;
    const { principalId } = req.session;

    const programIdNum = Number(programId);
    const activityIdNum = Number(activityId);

    if (!Number.isInteger(programIdNum) || programIdNum < 1) {
      next(new BadRequestError(`"${programIdNum}" is not a valid program id.`));
      return;
    }

    if (!Number.isInteger(activityIdNum) || activityIdNum < 1) {
      next(new BadRequestError(`"${activityId}" is not a valid activity id.`));
      return;
    }

    let updatedParticipantActivity;

    try {
      updatedParticipantActivity = await setParticipantActivityCompletion(
        principalId,
        programIdNum,
        activityIdNum,
        completed
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(updatedParticipantActivity));
  }
);

export default programsRouter;
