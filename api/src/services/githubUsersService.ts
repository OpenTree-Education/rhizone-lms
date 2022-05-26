import db from './db';
import { IUserData } from '../middleware/authRouter';

export const findGithubUserByGithubId = async (githubId: number) => {
  const [githubUser] = await db('github_users')
    .select('id', 'principal_id')
    .where({ github_id: githubId });
  return githubUser || null;
};

export const createGithubUser = async (githubUserData: IUserData) => {
  const githubUser: IUserData = {
    github_id: githubUserData.github_id,
    full_name: githubUserData.full_name,
    email: githubUserData.email,
    bio: githubUserData.bio,
    avatar_url: githubUserData.avatar_url,
  };
  await db.transaction(async trx => {
    const insertedPrincipalIds = await trx('principals').insert({
      entity_type: 'user',
    });
    const [principalId] = insertedPrincipalIds;
    githubUser.principal_id = principalId;
    const insertedGithubUsers = await trx('github_users').insert(githubUser);
    const [id] = insertedGithubUsers;
    githubUser.id = id;

    await trx('principal_social').insert([
      {
        principal_id: githubUser.principal_id,
        network_id: 1, // GitHub id in social_networks table
        data: githubUserData.github_username,
      },
      {
        principal_id: githubUser.principal_id,
        network_id: 3, // Twitter id in social_networks table
        data: githubUserData.twitter_username,
      },
    ]);
  });
  return githubUser;
};
