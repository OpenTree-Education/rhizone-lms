import db from './db';

export const findGithubUserByGithubId = async (githubId: number) => {
  const [githubUser] = await db('github_users')
    .select('id', 'principal_id')
    .where({ github_id: githubId });
  return githubUser || null;
};

export const createGithubUser = async (githubId: number) => {
  const githubUser: {
    github_id: number;
    id?: number;
    principal_id?: number;
  } = { github_id: githubId };
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
