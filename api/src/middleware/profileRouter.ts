import { Router } from 'express';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope } from './responseEnvelope';

const githubUsersRouter = Router();

githubUsersRouter.get('/:principal_id', async (req, res, next) => {
  const {principal_id} = req.params;
  const principalId = parseInt(principal_id);

  try {
    const user_profile_data = await getUserProfileData(principalId);

    res.json(collectionEnvelope(Array(user_profile_data), 1));
  } catch(err) {
    console.log('err', err)
    next(err);
    return;
  }

});

export default githubUsersRouter;
