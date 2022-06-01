import { ISocialProfile, IUserData } from '../models/user_models';
import db from './db';
import { findGithubUsersByPrincipalId } from './githubUsersService';

/**
 * This method returns everything we know about a user, including its info in
 * the `principals` table, its info in the `github_users` table, and its info
 * in the `principal_social` table.
 * 
 * @param principalId (integer) ID number of the principal in question
 * @returns Well-structured IUserData object or null if not found
 */
export const getUserProfileData = (principalId: number): Promise<IUserData | null> => {
  return db('principals')
    .select<IUserData[]>('id', 'full_name', 'email_address', 'bio')
    .where({ id: principalId })
    .limit(1).then(async (db_result: IUserData[]) => {
      const user: IUserData = db_result.length > 0 ? db_result[0] : null;

      if (user) {
        user.github_accounts = await findGithubUsersByPrincipalId(principalId);
        user.social_profiles = await getUserSocials(principalId).then((social_profiles: ISocialProfile[]) => {
          return social_profiles;
        });

        return user;
      }

      return user;
    }).catch((err) => {
      console.error(err);
      return null;
    });
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

