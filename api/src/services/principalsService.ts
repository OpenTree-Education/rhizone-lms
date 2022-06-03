import { IUserData, ISocialProfile } from '../models/user_models';
import db from './db';

/**
 * Parses a JSON object submitted and transforms it into one that conforms to the IUserData interface, if possible.
 * 
 * @param submitted_user_data (any) An object that needs to be parsed
 * @param path_principal_id (number) The principal defined in the URL path
 * @returns formatted object, if possible; Error if not
 */
export const parsePutSubmission = (submitted_user_data: any, path_principal_id: number) => {
  let submitted_user: IUserData;

  if (submitted_user_data.principal_id) {
    submitted_user = {
      principal_id: submitted_user_data.principal_id,
    };
  } else {
    throw new Error(
      'Malformed user object. Must conform to IUserData interface.'
    );
  }

  // test to make sure the path principal ID matches the principal ID in the UserData object that was submitted
  if (submitted_user.principal_id !== path_principal_id) {
    throw new Error(
      'Principal ID in IUserData object does not match the principal ID in path.'
    );
  }

  if (submitted_user_data.full_name) {
    submitted_user.full_name = submitted_user_data.full_name;
  }

  if (submitted_user_data.email_address) {
    submitted_user.email_address = submitted_user_data.email_address;
  }

  if (submitted_user_data.bio) {
    submitted_user.bio = submitted_user_data.bio;
  }

  if (submitted_user_data.social_profiles) {
    submitted_user_data.social_profiles.forEach((social_profile: any) => {
      let parsed_profile: ISocialProfile;

      if (
        social_profile.network_name &&
        social_profile.user_name &&
        social_profile.public
      ) {
        parsed_profile = {
          network_name: social_profile.network_name,
          user_name: social_profile.user_name,
          profile_url: '',
          public: social_profile.public,
        };

        submitted_user.social_profiles.push(parsed_profile);
      } else {
        throw new Error('Malformed social profile received');
      }
    });
  }

  return submitted_user;
}

/**
 *
 * @param existing_user_data
 * @param new_user_data
 */
export const compareAndUpdatePrincipals = (
  existing_user_data: IUserData,
  new_user_data: IUserData
) => {
  let modified_data = false;

  // for each element in the IUserData objects, compare to see if it's been updated
  // i.e does existing_user_data.bio == new_user_data.bio and so on

  if (existing_user_data.bio !== new_user_data.bio) {
    modifyBio(existing_user_data.principal_id, new_user_data.bio);
    modified_data = true;
  }

  if (existing_user_data.full_name !== new_user_data.full_name) {
    modifyFullName(existing_user_data.principal_id, new_user_data.full_name);
    modified_data = true;
  }

  if (existing_user_data.email_address !== new_user_data.email_address) {
    modifyEmailAddress(
      existing_user_data.principal_id,
      new_user_data.email_address
    );
    modified_data = true;
  }

  // if (existing_user_data.github_accounts[0].avatar_url !== new_user_data.github_accounts[0].avatar_url) {
  //   modifyAvatarURL(
  //     existing_user_data.principal_id,
  //     new_user_data.github_accounts[0].avatar_url
  //   );
  // }



  // existing_user_data.social_profiles.forEach((existing_user_data, index) => {

  //   if(existing_user_data !== new_user_data.social_profile)){
  //     addSocialProfile(existing_user_data.principal_id, new_user_data.social_profile)
  //   }

  //   if(existing_user_data[index] !== new_social_profile.social_profiles[index].user_name){
  //     modifySocialProfile(new_user_data.principal_id, new_social_profile)
  //   }

  // });

 
  // new_user_data.social_profiles.forEach(new_social_profile => {
  //   existing_user_data.social_profiles
  // });



  // make sure to disregard any changes that are meaningless, like if
  // existing_user_data.bio is "" and new_user_data.bio is 'undefined', don't worry about it

  // for each change, call the appropriate function that updates the database information
  return modified_data;
};

/**
 *
 * @param principal_id
 * @param social_profile
 */
export const addSocialProfile = async (
  principal_id: number,
  social_profile: ISocialProfile
) => {
  // TODO: figure out id of social profile
  await db('principal_social').insert({ principal_id: principal_id });
};

/**
 *
 * @param principal_id
 * @param social_profile
 */
export const modifySocialProfile = async (
  principal_id: number,
  social_profile: ISocialProfile
) => {
  // TODO: figure out id of social profile
  await db('principal_social').update({ principal_id: principal_id });
};

/**
 *
 * @param principal_id
 * @param social_profile
 */
export const deleteSocialProfile = async (
  principal_id: number,
  social_profile: ISocialProfile
) => {
  // TODO: figure out id of social profile
  await db('principal_social').where({ principal_id: principal_id }).del();
};

/**
 *
 * @param principal_id
 * @param bio
 */

export const modifyBio = async (principal_id: number, bio: string) => {
  await db('github_users').where({ principal_id }).update({ bio: bio });
};

/**
 *
 * @param principal_id
 * @param full_name
 */
export const modifyFullName = async (principal_id: number, full_name: string) => {
  await db('github_users').where({ principal_id }).update({ full_name: full_name });
};

/**
 *
 * @param principal_id
 * @param avatar_url
 */
export const modifyAvatarURL = async (principal_id: number, avatar_url: string) => {
  await db('github_users').where({ principal_id }).update({ avatar_url: avatar_url });
};

/**
 *
 * @param principal_id
 * @param email_address
 */
export const modifyEmailAddress = async (
  principal_id: number,
  email_address: string
) => {
  await db('github_users').where({ principal_id }).update({ email_address: email_address });
};
