import { Router } from 'express';
import { IUserData, ISocialProfile } from '../../src/models/user_models';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { compareAndUpdatePrincipals } from '../services/principalsService';

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
  const path_principal_id: number = parseInt(principal_id);
  const { principalId } = req.session;
  const session_principal_id: number = principalId;

  try {
    // test to make sure we have a principal ID defined
    if (principal_id == null) {
      throw new Error(
        'I was not passed a principal_id for which to show profile data.'
      );
    }

    // test to make sure the session principal ID matches the principal ID in path
    if (path_principal_id !== session_principal_id) {
      res.status(403);
      throw new Error('Session user does not match owner of profile.');
    }

    // parse the object we receive in the request into a well-formed IUserData object
    const submitted_user_data: any = itemEnvelope(req.body);

    let submitted_user: IUserData;

    if (submitted_user_data.principal_id) {
      submitted_user = {
        principal_id: submitted_user_data.principal_id,
      };
    } else {
      throw new Error(
        'Malformed user object. Must conform to IUserData interface.'
      );
    }

    // test to make sure the path principal ID matches the principal ID in the UserData object that was submitted
    if (submitted_user.principal_id !== path_principal_id) {
      throw new Error(
        'Principal ID in IUserData object does not match the principal ID in path.'
      );
    }

    if (submitted_user_data.full_name) {
      submitted_user.full_name = submitted_user_data.full_name;
    }

    if (submitted_user_data.email_address) {
      submitted_user.email_address = submitted_user_data.email_address;
    }

    if (submitted_user_data.bio) {
      submitted_user.bio = submitted_user_data.bio;
    }

    if (submitted_user_data.social_profiles) {
      submitted_user_data.social_profiles.forEach((social_profile: any) => {
        let parsed_profile: ISocialProfile;

        if (
          social_profile.network_name &&
          social_profile.user_name &&
          social_profile.public
        ) {
          parsed_profile = {
            network_name: social_profile.network_name,
            user_name: social_profile.user_name,
            profile_url: '',
            public: social_profile.public,
          };

          submitted_user.social_profiles.push(parsed_profile);
        } else {
          throw new Error('Malformed social profile received');
        }
      });
    }

    const path_user_profile_data = await getUserProfileData(principalId);

    // send the object to a function that will compare the IUserData object to the existing one
    // and update the database accordingly.
    if (compareAndUpdatePrincipals(path_user_profile_data, submitted_user)) {
      res.status(201);
    } else {
      res.status(403);
      throw new Error('Unable to update user profile');
    }

    // send back the appropriate HTTP status code and appropriate response to the requester
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

export default profileRouter;
