import { Router } from 'express';
import db from '../services/db';
import { ISocialNetwork } from '../models/user_models';
import { collectionEnvelope } from './responseEnvelope';

const socialNetworksRouter = Router();

socialNetworksRouter.get('/', async (_req, res, next) => {
  try {
    const social_networks_query = db('social_networks').select<ISocialNetwork[]>("*");
    social_networks_query.then((social_networks_list: ISocialNetwork[]) => {
      res.json(collectionEnvelope(social_networks_list, social_networks_list.length));
    });
  } catch (err) {
    console.error('err', err);
    next(err);
    return;
  }
});

export default socialNetworksRouter;