import { Router } from 'express';
import { collectionEnvelope } from './responseEnvelope';
import { listSocialNetworks } from '../services/socialNetworksService';
import { ISocialNetwork } from '../models/user_models';

const socialNetworksRouter = Router();

socialNetworksRouter.get('/', async (_req, res, next) => {
  try {
    await listSocialNetworks().then(
      (social_networks_list: ISocialNetwork[]) => {
        res.json(
          collectionEnvelope(social_networks_list, social_networks_list.length)
        );
      }
    );
  } catch (err) {
    next(err);
    return;
  }
});

export default socialNetworksRouter;
