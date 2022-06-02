import { Router } from 'express';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope } from './responseEnvelope';

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

profileRouter.get('/:principal_id', async (req, res, next) => {
  const { principal_id } = req.params;
  const principalId = parseInt(principal_id);

  try {
    if (principal_id == null) {
      throw new Error(
        'I was not passed a principal_id for which to show profile data.'
      );
    }

    // TODO: need to check here if we're getting our own profile or someone else's!
    // If it's someone else's, don't show non-public social links.
    const user_profile_data = await getUserProfileData(principalId);

    if (user_profile_data == null) {
      throw new Error(
        `I couldn't find a principal ID matching ${principal_id}`
      );
    }

    res.json(collectionEnvelope(Array(user_profile_data), 1));
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

profileRouter.put('/:principal_id', async (req, res, next) => {
  const { principal_id } = req.params;
  const principalId = parseInt(principal_id);

  try {
    // test to make sure the principal ID matches the principal ID of the user being modified

    // parse the object we receive in the request into a well-formed IUserData object

    // send the object to a function that will compare the IUserData object to the existing one
    // and update the database accordingly.

    // send back the appropriate HTTP status code and appropriate response to the requester
    
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }

})

export default profileRouter;
