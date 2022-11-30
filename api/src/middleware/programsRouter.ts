import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import {
  listProgramsWithActivities,
  getParticipantActivityCompletion,
} from '../services/programsService'; // add participantActivity functions

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

    let participantActivityId;
    let activityCompletionStatus; // alternative variable names: isCompleted; completionStatus

    // checks:
    // program exists
    // activity exists
    // curriculumId of program matches curriculumId of activity
    // there's a ParticipantActivities record associated with the specified principalId, programId, and activityId

    try {
      activityCompletionStatus = await getParticipantActivityCompletion(
        principalId,
        Number(programId),
        Number(activityId)
      );
    } catch (err) {
      next(err);
      return;
    }

    res.json(itemEnvelope({ status: activityCompletionStatus }));
  }
);

export default programsRouter;
