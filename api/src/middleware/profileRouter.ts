import { Router } from 'express';
import { getUserProfileData } from '../services/getUserProfileDataService';
import { collectionEnvelope } from './responseEnvelope';
import {
  compareAndUpdatePrincipals,
  parsePutSubmission,
} from '../services/principalsService';
import { IUserData } from '../models/user_models';
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from './httpErrors';

const profileRouter = Router();

profileRouter.get('/', async (_req, _res, next) => {
  next(
    new BadRequestError(
      'I need to be passed a numerical principal ID in the path.'
    )
  );
  return;
});

profileRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  let session_id: number;
  let path_id: number;

  // test to make sure we have a numerical principal ID defined
  try {
    path_id = parseInt(id);
    if (isNaN(path_id)) {
      throw new BadRequestError(
        'I was not passed an integer id for which to edit profile data.'
      );
    }
  } catch (err) {
    next(err);
    return;
  }

  try {
    const { principalId } = req.session;
    if (
      typeof principalId !== 'number' ||
      principalId === null ||
      isNaN(principalId)
    ) {
      throw new BadRequestError('Non-numerical principal ID given.');
    }
    session_id = principalId;
  } catch (err) {
    session_id = -1;
  }

  try {
    await getUserProfileData(path_id, session_id).then(user_profile_data => {
      res.json(collectionEnvelope(Array(user_profile_data), 1));
    });
  } catch (err) {
    next(err);
    return;
  }
});

profileRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  let session_id: number;
  let path_id: number;
  let path_user_profile_data: IUserData;

  // test to make sure we have a numerical principal ID defined
  try {
    path_id = parseInt(id);
    if (isNaN(path_id)) {
      throw new BadRequestError(
        'I was not passed an integer id for which to edit profile data.'
      );
    }
  } catch (err) {
    next(err);
    return;
  }

  try {
    const { principalId } = req.session;
    if (
      typeof principalId !== 'number' ||
      principalId === null ||
      isNaN(principalId)
    ) {
      throw new UnauthorizedError();
    }
    session_id = principalId;

    // test to make sure the session principal ID matches the principal ID in path
    if (path_id !== session_id) {
      next(new ForbiddenError('Session user does not match owner of profile.'));
      return;
    }

    // parse the object we receive in the request into a well-formed IUserData object
    // submitted_user is a validated IUserData object that we received from the request
    const submitted_user_data_request = req.body;
    let submitted_user;

    if (
      submitted_user_data_request.data &&
      submitted_user_data_request.data.length > 0
    ) {
      submitted_user = parsePutSubmission(
        submitted_user_data_request.data[0],
        path_id
      );
    } else {
      throw new BadRequestError('Request did not come in entity format.');
    }

    // get the appropriate existing IUserData for that principal for comparison's sake
    path_user_profile_data = await getUserProfileData(path_id, session_id);

    // send the object to a function that will compare the IUserData object to the existing one
    // and update the database accordingly.
    const modified_data = await compareAndUpdatePrincipals(
      path_user_profile_data,
      submitted_user
    );
    if (modified_data) {
      res.status(200);
      res.json(
        collectionEnvelope([await getUserProfileData(path_id, session_id)], 1)
      );
    } else {
      // Leaving this redundancy in place here in case we decide to implement
      // different behavior in the future.
      res.status(200);
      res.json(
        collectionEnvelope([await getUserProfileData(path_id, session_id)], 1)
      );
    }

    // send back the appropriate HTTP status code and appropriate response to the requester
  } catch (err) {
    next(err);
    return;
  }
});

export default profileRouter;
