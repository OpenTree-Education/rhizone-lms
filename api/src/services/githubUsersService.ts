import db from './db';
import { getDarkMode } from './darkModeService';

export const findGithubUserByGithubId = async (githubId: number) => {
  const [githubUser] = await db('github_users')
    .select('id', 'principal_id')
    .where({ github_id: githubId });
  if (githubUser) {
    githubUser.dark_mode = getDarkMode(githubUser.principal_id);
  }
  return githubUser || null;
};

export const createGithubUser = async (githubId: number) => {
  const githubUser: {
    github_id: number;
    id?: number;
    principal_id?: number;
    dark_mode?: boolean;
  } = { github_id: githubId, dark_mode: false };
  await db.transaction(async trx => {
    const insertedPrincipalIds = await trx('principals').insert({
      entity_type: 'user',
      dark_mode: githubUser.dark_mode
    });
    const [principalId] = insertedPrincipalIds;
    githubUser.principal_id = principalId;
    const insertedGithubUsers = await trx('github_users').insert(githubUser);
    const [id] = insertedGithubUsers;
    githubUser.id = id;
  });
  return githubUser;
};
