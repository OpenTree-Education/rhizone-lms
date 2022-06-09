import db from './db';
import { IGitHubUser } from '../models/user_models';
import { NotFoundError } from '../middleware/httpErrors';

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
): Promise<IGitHubUser> => {
  const github_user: IGitHubUser = await db('github_users')
    .select<IGitHubUser[]>(
      'github_id',
      'username',
      'full_name',
      'bio',
      'avatar_url',
      'principal_id'
    )
    .where({ github_id: githubId })
    .limit(1).then((query_data: IGitHubUser[]) => {
      if (query_data.length == 0) {
        throw new NotFoundError(`Can't find any data for GitHub ID ${githubId}`);
      }
      return query_data[0];
    });

  return github_user;
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
): Promise<IGitHubUser[]> => {
  const github_users: IGitHubUser[] = await db('github_users')
    .select<IGitHubUser[]>(
      'github_id',
      'username',
      'full_name',
      'bio',
      'avatar_url',
      'principal_id'
    )
    .where({ principal_id: principalId }).then((query_data: IGitHubUser[]) => {
      if (query_data.length == 0) {
        throw new NotFoundError(`Can't find any data for principal ID ${principalId}`);
      }
      return query_data;
    });

  return github_users;
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
            });
        }).catch((err) => {
          throw err;
        });
    })
    .then(gh_user => {
      return gh_user;
    });
};
