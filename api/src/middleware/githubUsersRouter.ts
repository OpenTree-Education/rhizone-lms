import { Router } from 'express';
import { getUserProfileData, getUserSocials } from '../services/getUserProfileDataService';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';

//
import { countUserSocialsData, listUserSocialsData } from '../services/getUserProfileDataService';

const githubUsersRouter = Router();

githubUsersRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  // console.log({session: principalId })
  let userData;
  let userSocials;
  let userSocialsCount;
  try {
    //@param: principalId
    [ userData, userSocialsCount] = await Promise.all([ 
      getUserProfileData(principalId),
      // listUserSocialsData(),
      countUserSocialsData()
    ])
  } catch(err) {
    console.log('err', err)
    next(err);
    return;
  }

  console.log({userData: userData})
  console.log({userSocialsCount: userSocialsCount})
  //console.log({userSocials: userSocials})

  console.log("collectionEnvelop", collectionEnvelope(userData, userSocialsCount))
 
  res.json(collectionEnvelope(userData, userSocialsCount))
});

// githubUsersRouter.get('/', async (req, res, next) => {
//   const { principalId } = req.session;
//   // console.log({session: principalId })
//   let userData;
//   let userSocials;
//   try {
//     //@param: principalId
//     [ userData, userSocials ] = await Promise.all([ getUserProfileData(principalId),
//       getUserSocials(principalId),
//     ])
//   } catch(err) {
//     console.log('err', err)
//     next(err);
//     return;
//   }

//   console.log({userData: userData})
//   console.log({ userSocials: userSocials})
//   console.log( typeof userSocials)
//   res.json(collectionEnvelope(userData, userSocials))

// });

export default githubUsersRouter;
