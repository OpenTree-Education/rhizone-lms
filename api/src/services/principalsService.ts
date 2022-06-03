import { IUserData, ISocialProfile } from '../models/user_models';
import db from './db';

/**
 *
 * @param existing_user_data
 * @param new_user_data
 */
export const compareAndUpdatePrincipals = (
  existing_user_data: IUserData,
  new_user_data: IUserData
) => {
  // for each element in the IUserData objects, compare to see if it's been updated
  // i.e does existing_user_data.bio == new_user_data.bio and so on

  if (existing_user_data.bio !== new_user_data.bio) {
    modifyBio(existing_user_data.principal_id, new_user_data.bio);
  }

  if (existing_user_data.full_name !== new_user_data.full_name) {
    modifyFullName(existing_user_data.principal_id, new_user_data.full_name);
  }

  if (existing_user_data.email_address !== new_user_data.email_address) {
    modifyEmailAddress(
      existing_user_data.principal_id,
      new_user_data.email_address
    );
  }

  //new_user_data.social_profiles.forEach(new_social_profile => {});

  // const existing_avatar_url = existing_user_data.github_accounts.map(item => {
  //   item.avatar_url;
  // });

  // const map_new_avatar_url = new_user_data.github_accounts.map(item => {
  //   item.avatar_url;
  // });

  // if (existing_avatar_url !== new_avatar_url) {
  //   modifyAvatarURL(existing_user_data.principal_id, new_avatar_url);
  // }

  // make sure to disregard any changes that are meaningless, like if
  // existing_user_data.bio is "" and new_user_data.bio is 'undefined', don't worry about it

  // for each change, call the appropriate function that updates the database information
  return existing_user_data;
};

/**
 *
 * @param principal_id
 * @param social_profile
 */
const addSocialProfile = (
  principal_id: number,
  social_profile: ISocialProfile
) => {};

/**
 *
 * @param principal_id
 * @param social_profile
 */
const modifySocialProfile = (
  principal_id: number,
  social_profile: ISocialProfile
) => {};

/**
 *
 * @param principal_id
 * @param social_profile
 */
const deleteSocialProfile = (
  principal_id: number,
  social_profile: ISocialProfile
) => {};

/**
 *
 * @param principal_id
 * @param bio
 */

const modifyBio = async (principal_id: number, bio: string) => {
  await db('github_users').where({ principal_id }).update({ bio });
};

/**
 *
 * @param principal_id
 * @param full_name
 */
const modifyFullName = async (principal_id: number, full_name: string) => {
  await db('github_users').where({ principal_id }).update({ full_name });
};

//console.log(modifyFullName)

/**
 *
 * @param principal_id
 * @param avatar_url
 */
const modifyAvatarURL = async (principal_id: number, avatar_url: string) => {
  await db('github_users').where({ principal_id }).update({ avatar_url });
};

/**
 *
 * @param principal_id
 * @param email_address
 */
const modifyEmailAddress = async (
  principal_id: number,
  email_address: string
) => {
  await db('github_users').where({ principal_id }).update({ email_address });
};
