import db from './db';

export const getUserProfileData = async (principalId: number) => {
  const [userProfileData] = await db('github_users')
    .select()
    .where({ principal_id: principalId });
  //console.log({upd: userProfileData})
  return userProfileData || null;
};

export const getUserSocials = async (principalId: number) => {
  // const [userSocialsData] = await db('social_networks')
  // .select()
  // .where({id: principalId});
  // .where({id: 1}); // 1 -> github, 4 -> reddit === social_networks id

  const [userSocialsData] = await db('principal_social')
    .select(
      db.raw(
        'CONCAT("https://", social_networks.base_url, "/", principal_social.data) as url, social_networks.icon_name'
      )
    )
    .where({ principal_id: principalId })
    .leftJoin('social_networks', function () {
      this.on('social_networks.id', '=', 'principal_social.network_id');
    })
    .andWhere('network_id', '<', '4');

  /* 
    
    SELECT CONCAT("https://", social_networks.base_url, "/", principal_social.data) as url, social_networks.icon_name 
    FROM principal_social 
    WHERE principal_id=(whatever the principal id is) 
    LEFT JOIN social_networks 
    ON principal_social.network_id=social_networks.id
    
    */

  console.log({ socialN: userSocialsData });
  return userSocialsData || null;
};

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
