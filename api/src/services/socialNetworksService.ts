import db from '../services/db';
import { ISocialNetwork } from '../models/user_models';

export const listSocialNetworks = async (): Promise<ISocialNetwork[]> => {
  return db('social_networks').select<ISocialNetwork[]>('*');
};
