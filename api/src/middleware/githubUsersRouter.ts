import { Router } from 'express';
import { getUserProfileData, getUserSocials } from '../services/getUserProfileDataService';
import { collectionEnvelope } from './responseEnvelope';

const githubUsersRouter = Router();

githubUsersRouter.get('/', async (req, res, next) => {
  let user_data;
  let user_socials;

  const {principalId} = req.session;

  try {
    user_data = await getUserProfileData(principalId);
    user_socials = await getUserSocials(principalId);

    console.log({"user_data": user_data, "user_socials": user_socials})

    res.json(collectionEnvelope(user_data, user_data.length))
  } catch(err) {
    console.log('err', err)
    next(err);
    return;
  }

});

export default githubUsersRouter;
