import db from './db';
import { IUserData } from '../middleware/authRouter';

export const findGithubUserByGithubId = async (githubId: number) => {
  const [githubUser] = await db('github_users')
    .select('id', 'principal_id')
    .where({ github_id: githubId });
  return githubUser || null;
};

export const createGithubUser = async (githubUserData: IUserData) => {
  console.log('Creating GitHub user...');
  const githubUser: {
    github_id: number;
    id?: number;
    principal_id?: number;
    full_name?: string;
  } = { github_id: githubUserData.id, full_name: githubUserData.fullname };
  await db.transaction(async trx => {
    const insertedPrincipalIds = await trx('principals').insert({
      entity_type: 'user',
    });
    const [principalId] = insertedPrincipalIds;
    githubUser.principal_id = principalId;
    const insertedGithubUsers = await trx('github_users').insert(githubUser);
    const [id] = insertedGithubUsers;
    githubUser.id = id;
  });
  return githubUser;
};
