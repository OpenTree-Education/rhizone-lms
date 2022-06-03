import { Router } from 'express';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { compareAndUpdatePrincipals, parsePutSubmission } from '../services/principalsService';

const profileRouter = Router();

profileRouter.get('/', async (_req, _res, next) => {
  try {
    throw new Error('I need to be passed a principal ID.');
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

profileRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const principalId = parseInt(id);

  try {
    if (id == null) {
      throw new Error(
        'I was not passed a id for which to show profile data.'
      );
    }

    // TODO: need to check here if we're getting our own profile or someone else's!
    // If it's someone else's, don't show non-public social links.
    const user_profile_data = await getUserProfileData(principalId);

    if (user_profile_data == null) {
      throw new Error(
        `I couldn't find a principal ID matching ${id}`
      );
    }

    res.json(collectionEnvelope(Array(user_profile_data), 1));
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

profileRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const path_id: number = parseInt(id);
  const { principalId } = req.session;
  const session_id: number = principalId;

  try {
    // test to make sure we have a principal ID defined
    if (id == null) {
      throw new Error(
        'I was not passed a id for which to show profile data.'
      );
    }

    // test to make sure the session principal ID matches the principal ID in path
    if (path_id !== session_id) {
      res.status(403);
      throw new Error('Session user does not match owner of profile.');
    }

    // parse the object we receive in the request into a well-formed IUserData object
    // submitted_user is a validated IUserData object that we received from the request
    const submitted_user_data = itemEnvelope(req.body);
    const submitted_user = parsePutSubmission(submitted_user_data, path_id);

    // get the appropriate existing IUserData for that principal for comparison's sake
    const path_user_profile_data = await getUserProfileData(principalId);

    // send the object to a function that will compare the IUserData object to the existing one
    // and update the database accordingly.
    const modified_data = compareAndUpdatePrincipals(path_user_profile_data, submitted_user);
    if (modified_data) {
      res.status(200);
      res.json(collectionEnvelope([await getUserProfileData(principalId)], 1));
    } else {
      // Leaving this redundancy in place here in case we decide to implement
      // different behavior in the future.
      res.status(200);
      res.json(collectionEnvelope([await getUserProfileData(principalId)], 1));
    }

    // send back the appropriate HTTP status code and appropriate response to the requester
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

export default profileRouter;
