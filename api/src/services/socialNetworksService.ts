import db from '../services/db';
import { ISocialNetwork } from '../models/user_models';

export const listSocialNetworks = async (): Promise<ISocialNetwork[]> => {
  return db('social_networks').select<ISocialNetwork[]>('*');
};

export const getSocialNetworkID = (network_name: string): Promise<number> => {
  return db('social_networks').select<number>('id').where({network_name: network_name}).limit(1);
}
