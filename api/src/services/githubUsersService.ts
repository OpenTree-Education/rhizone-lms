import db from './db';
import { IGitHubUser } from '../models/user_models';

export const findGithubUserByGithubId = async (githubId: number): Promise<IGitHubUser> => {
  const principal_id: IGitHubUser = await db('github_users')
    .select<IGitHubUser>('github_id', 'username', 'full_name', 'email', 'bio', 'avatar_url')
    .where({ github_id: githubId })
    .limit(1);

  return principal_id;
};

export const createGithubUser = async (githubUser: IGitHubUser) => {
  await db.transaction(async trx => {
    const insertedPrincipalIds = await trx('principals').insert({
      entity_type: 'user',
    });
    const [principalId] = insertedPrincipalIds;
    githubUser.principal_id = principalId;
    const insertedGithubUsers = await trx('github_users').insert(githubUser);

    console.log("Inserted GitHub user.", insertedGithubUsers);

    await trx('principal_social').insert({
      principal_id: githubUser.principal_id,
      network_id: 1, // GitHub id in social_networks table
      data: githubUser.username
    });
  });
  return githubUser;
};
