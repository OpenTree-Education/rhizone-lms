import { Router } from 'express';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope } from './responseEnvelope';

const profileRouter = Router();

profileRouter.get('/', async (_req, _res, next) => {
  try {
    throw new Error("I need to be passed a principal ID.");
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

profileRouter.get('/:principal_id', async (req, res, next) => {
  const {principal_id} = req.params;
  const principalId = parseInt(principal_id);

  try {
    if (principal_id == null) {
      throw new Error("I was not passed a principal_id for which to show profile data.");
    }

    // TODO: need to check here if we're getting our own profile or someone else's!
    // If it's someone else's, don't show non-public social links.
    const user_profile_data = await getUserProfileData(principalId);

    if (user_profile_data == null) {
      throw new Error(`I couldn't find a principal ID matching ${principal_id}`);
    }

    res.json(collectionEnvelope(Array(user_profile_data), 1));
  } catch (err) {
    console.error('err', err)
    next(err);
    return;
  }

});

profileRouter.post('/:principal_id', async (req, res, next) => {
  const {principal_id} = req.params;
  const principalId = parseInt(principal_id);
  const current_principal = req.session.principalId;

  // Check to make sure we're logged into the same principal_id for which we got the request
  
  // Parse the submitted information into usable information

  // Call each individual function to save the modified data into the database
});

export default profileRouter;
