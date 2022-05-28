import db from './db';

export const getUserProfileData = async (principalId: number) => {
  const [userProfileData] = await db('github_users')
    .select()
    .where({ principal_id: principalId});
    console.log({upd: userProfileData})
  return userProfileData || null;
}

export const getUserSocials = async (principalId: number) => {
  const [userSocialsData] = await db('social_networks')
  .select()
  .where({id: principalId});
  console.log({socialN: userSocialsData});
  return userSocialsData || null;
}