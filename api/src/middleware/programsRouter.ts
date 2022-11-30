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

programsRouter.get('/activityStatus/:programId/:activityId', async (req, res, next) => {
// look into what `next` param is for and identify whether necessary here (it's present in almost all other router functions except the GET Programs function right above here)
// is it possible to define programId and activityId on one line?: const { programId, activityId } = req.params
const { programId } = req.params;
const { activityId } = req.params;
const { principalId } = req.session;

let participantActivityId;
let activityCompletionStatus; // alternative variable names: isCompleted; completionStatus

// participantActivityId = getParticipantActivityId(principalId, programId, activityId)
  // value will look like: `{ id: participantActivityId }`

// checks:
  // program exists
  // activity exists
  // curriculumId of program matches curriculumId of activity
  // there's a ParticipantActivities record associated with the specified principalId, programId, and activityId

// activityCompletionStatus = getCompletionStatus(participantActivityId)
// wrap activityCompletionStatus in itemEnvelope: res.json(itemEnvelope({ activityCompletionStatus: <boolean value> }));
  // thinking this^ should be a key/value pair so that webapp can reference the value by the key?
});

export default programsRouter;
