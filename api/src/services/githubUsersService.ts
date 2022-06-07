import db from './db';
import { IGitHubUser } from '../models/user_models';

/**
 * This function searches the `github_users` table for entries matching a
 * GitHub user ID. If it finds a row, it returns it, formatted as an
 * IGitHubUser object. If it doesn't, it returns null.
 *
 * @param githubId (integer) GitHub user ID
 * @returns IGitHubUser corresponding to row in table or null
 */
export const findGithubUserByGithubId = async (
  githubId: number
): Promise<IGitHubUser | null> => {
  const github_users: IGitHubUser[] = await db('github_users')
    .select<IGitHubUser[]>(
      'github_id',
      'username',
      'full_name',
      'bio',
      'avatar_url',
      'principal_id'
    )
    .where({ github_id: githubId })
    .limit(1);

  return github_users.length > 0 ? github_users[0] : null;
};

/**
 * This function searches the `github_users` table for entries matching a
 * principal ID. If it finds matches, it returns them, formatted as
 * IGitHubUser objects. If it doesn't, it returns null.
 *
 * @param principalId (integer) principal ID number
 * @returns IGitHubUser[] corresponding to rows in table or null
 */
export const findGithubUsersByPrincipalId = async (
  principalId: number
): Promise<IGitHubUser[] | null> => {
  const github_users: IGitHubUser[] = await db('github_users')
    .select<IGitHubUser[]>(
      'github_id',
      'username',
      'full_name',
      'bio',
      'avatar_url',
      'principal_id'
    )
    .where({ principal_id: principalId });

  return github_users.length > 0 ? github_users : null;
};

/**
 * Creates an entry in the `github_users` table with the information passed.
 *
 * @param githubUser (IGitHubUser) object containing data to insert into table
 * @returns same object as parameter but with the principal_id instantiated
 */
export const createGithubUser = async (
  githubUser: IGitHubUser
): Promise<IGitHubUser> => {
  return db
    .transaction(async trx => {
      // TODO: we need to pre-populate the principal table with the bio and
      // full_name fields from GitHub but allow the user to override.
      return trx('principals')
        .insert({
          entity_type: 'user',
        })
        .then(async principal_ids => {
          const gh_user: IGitHubUser = githubUser;
          [gh_user.principal_id] = principal_ids;
          await trx('github_users').insert(gh_user);
          return gh_user;
        })
        .then(async gh_user => {
          return await trx('principal_social')
            .insert({
              principal_id: gh_user.principal_id,
              network_id: 1, // GitHub id in social_networks table
              data: gh_user.username,
              public: true,
            })
            .then(() => {
              return gh_user;
            })
            .catch(err => {
              console.error(err);
              return githubUser;
            });
        })
        .catch(err => {
          console.error(err);
          return githubUser;
        });
    })
    .then(gh_user => {
      return gh_user;
    })
    .catch(err => {
      console.error(err);
      return githubUser;
    });
};
