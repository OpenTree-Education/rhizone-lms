import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { BadRequestError } from './httpErrors';

const assessmentsDummyRouter = Router();

assessmentsDummyRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  // let programsWithActivities;
  try {
    // programsWithActivities = await listProgramsWithActivities(principalId);
  } catch (error) {
    next(error);
    return;
  }
  res
    .json
    // collectionEnvelope(programsWithActivities, programsWithActivities.length)
    ();
});

assessmentsDummyRouter.get(
  '/makeParticipant/:programId/:participantId',
  async (req, res, next) => {
    const { principalId } = req.session;

    try {
    } catch (error) {
      next(error);
      return;
    }
    res.json();
  }
);

assessmentsDummyRouter.get('/', async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
    return;
  }
  res.json();
});
assessmentsDummyRouter.get('/', async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
    return;
  }
  res.json();
});

export default assessmentsDummyRouter;
