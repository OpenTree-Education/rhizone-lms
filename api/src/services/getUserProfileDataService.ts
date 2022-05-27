import db from './db';

export const getUserProfileDataService = async (principalId: number) => {
  const [userProfileData] = await db('github_users')
    .select()
    .where({ principal_id: principalId});
    console.log({upd: userProfileData})
  return userProfileData || null;
}