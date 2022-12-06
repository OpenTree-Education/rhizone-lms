import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { NotFoundError, ValidationError } from './httpErrors';
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

    // q: should these be moved into the try/catch statement so that an error is thrown if the id params cant be translated into a num?
    // a: Good thinking! Check out line 12 in questionnairesRouter for an example of how to handle this without try/catch.
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
    // TODO: activityCompletionStatus should always be true/false, since we've decided not to do any error checking on the backend
    if (!activityCompletionStatus) {
      next(
        new NotFoundError(
          `A participant activity with the activity id "${activityIdNum}" could not be found.`
        )
      );
    }

    res.json(
      itemEnvelope({
        programId: programIdNum,
        activityId: activityIdNum,
        completed: activityCompletionStatus,
      })
    );
  }
);

programsRouter.put(
  '/activityStatus/:programId/:activityId',
  async (req, res, next) => {
    const { programId, activityId } = req.params;
    const { completed } = req.body;
    // request body shoud look like: {"completed": true}
    const { principalId } = req.session;

    // TODO: see comment from line 31 above
    const programIdNum = Number(programId);
    const activityIdNum = Number(activityId);

    let updatedCompletionStatus;

    // q: will this also address a case in which a completed value is not included in the request body?
    // a: if the body doesn't contain a key called "completed", then the value of completed will be null
    if (typeof completed !== 'boolean') {
      next(new ValidationError('`completed` must be a boolean'));
      return;
    }

    try {
      updatedCompletionStatus = await setParticipantActivityCompletion(
        principalId,
        programIdNum,
        activityIdNum,
        completed
      );

      // TODO: this function should return the row ID if successful. send back an error if it isn't.
      if (typeof updatedCompletionStatus !== 'number') {
      }
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
