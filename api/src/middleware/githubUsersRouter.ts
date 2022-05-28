import { Router } from 'express';
import { getUserProfileData, getUserSocials } from '../services/getUserProfileDataService';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';

const githubUsersRouter = Router();

githubUsersRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  // console.log({session: principalId })
  let userData;
  let userSocials;
  try {
    //@param: principalId
    [ userData, userSocials ] = await Promise.all([ getUserProfileData(principalId),
      getUserSocials(principalId),
    ])
  } catch(err) {
    console.log('err', err)
    next(err);
    return;
  }

  console.log({userData: userData})
  res.json(collectionEnvelope(userData, userSocials))

});

export default githubUsersRouter;
