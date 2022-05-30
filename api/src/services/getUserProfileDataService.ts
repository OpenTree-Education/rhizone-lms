import db from './db';

export const getUserProfileData = async (principalId: number) => {
  const [userProfileData] = await db('github_users')
    .select()
    .where({principal_id: principalId});
    //console.log({upd: userProfileData})
  return userProfileData || null;
}


export const getUserSocials = async (principalId: number) => {
  // const [userSocialsData] = await db('social_networks')
  // .select()
  // .where({id: principalId});
  // .where({id: 1}); // 1 -> github, 4 -> reddit === social_networks id

  const [userSocialsData] = await db('social_networks')
  .select()
  .where({ principal_id: principalId})

  console.log({socialN: userSocialsData});
  return userSocialsData || null;
}


// export const countUserSocialsData = async () => {
//   const countAlias = 'total_count';
//   const [count] = await db('social_networks').count({ [countAlias]: '*' });
//   return count[countAlias];
// };

// export const listUserSocialsData = async () => {
//   const userSocialsData = await db('social_networks')
//     .select('id', 'base_url', 'icon_name')

//   return userSocialsData;
//};