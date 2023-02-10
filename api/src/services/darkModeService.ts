import db from './db';

export const getDarkMode = async (principalId: number) => {
  const {dark_mode: darkModePreference} = await db('principals').first('dark_mode').where({id: principalId});
  return !!darkModePreference;
};

export const setDarkMode = async (principalId: number, darkModePreference: boolean) => {
  await db.transaction(async trx => {
    await trx('principals').update({dark_mode: darkModePreference}).where({id: principalId});
  });
  return;
};
