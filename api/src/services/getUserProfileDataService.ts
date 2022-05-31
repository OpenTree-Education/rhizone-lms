import { ISocialProfile } from '../models/user_models';
import db from './db';

/**
 * This method returns everything we know from GitHub for a given principal.
 * 
 * @param principalId (integer) ID number of the principal in question
 * @returns GitHub data for that principal
 */
export const getUserProfileData = async (principalId: number) => {
  const [userProfileData] = await db('github_users')
    .select()
    .where({ principal_id: principalId });
  return userProfileData || null;
};

export const getUserSocials = async (principalId: number): Promise<ISocialProfile[]> => {

  const social_profiles: ISocialProfile[] = await db('principal_social')
  .select(
    db.raw('`social_networks`.`network_name`, `principal_social`.`data` as user_name, CONCAT("https://", `social_networks`.`base_url`, "/", `principal_social`.`data`) AS profile_url'),)
  .where({principal_id: principalId})
  .whereNotNull('data')
  .leftJoin('social_networks', 'principal_social.network_id', 'social_networks.id');

  return social_profiles;

};

