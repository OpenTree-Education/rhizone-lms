import { NotFoundError } from '../middleware/httpErrors';
import { ISocialProfile, IUserData } from '../models/user_models';
import db from './db';
import { findGithubUsersByPrincipalId } from './githubUsersService';

/**
 * This function returns everything we know about a user, including its info in
 * the `principals` table, its info in the `github_users` table, and its info
 * in the `principal_social` table.
 *
 * @param principalId (integer) ID number of the principal in question
 * @returns Well-structured IUserData object or null if not found
 */
export const getUserProfileData = async (
  principalId: number,
  userPrincipalId: number
): Promise<IUserData> => {
  if (principalId === userPrincipalId) {
    // TODO: return public and private info
  } else {
    // TODO: return public info only
  }
  return await db('principals')
    .select<IUserData[]>('id', 'full_name', 'email_address', 'bio')
    .where({ id: principalId })
    .limit(1)
    .then(async db_result => {
      if (db_result.length === 0) {
        throw new NotFoundError(`Cannot find principal ID ${principalId}`);
      }

      const [user] = db_result;

      return await Promise.all([
        findGithubUsersByPrincipalId(principalId),
        getUserSocials(principalId),
      ]).then(values => {
        [user.github_accounts, user.social_profiles] = values;
        return user;
      });
    });
};

/**
 * This function grabs all the social profiles that we've defined for the user.
 * At a minimum, it should have at least one profile, the GitHub username,
 * since we're currently requiring GitHub for login into the system. Each field
 * will also have a `public` field telling us if we should be showing this on a
 * public profile page or if it should only should show when the user is
 * editing their profile.
 *
 * @param principalId (integer) ID of the user that we want social data for
 * @returns (ISocialProfile[]) all matching social profiles for the user
 */
export const getUserSocials = async (
  principalId: number
): Promise<ISocialProfile[] | null> => {
  const db_query = await db
    .select<
      {
        network_name: string;
        user_name: string;
        profile_url: string;
        public: string;
      }[]
    >(
      db.raw('`social_networks`.`network_name` as network_name'),
      db.raw('`principal_social`.`data` as user_name'),
      db.raw(
        'CONCAT(`social_networks`.`protocol`, `social_networks`.`base_url`, `principal_social`.`data`) AS profile_url'
      ),
      db.raw('IF(`principal_social`.`public`, "true", "false") as public')
    )
    .from('principal_social')
    .where('principal_id', principalId)
    .whereNotNull('data')
    .leftJoin(
      'social_networks',
      'principal_social.network_id',
      'social_networks.id'
    )
    .then(returned_rows => {
      if (returned_rows.length == 0) {
        return null;
      }
      const social_profiles: ISocialProfile[] = [];
      returned_rows.forEach(row => {
        social_profiles.push({
          network_name: row.network_name,
          user_name: row.user_name,
          profile_url: row.profile_url,
          public: row.public === 'true',
        });
      });

      return social_profiles;
    });
  return db_query;
};
