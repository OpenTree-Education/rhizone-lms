import { ForbiddenError } from '../middleware/httpErrors';
import { BadRequestError } from '../middleware/httpErrors';
import {
  IUserData,
  ISocialProfile,
  ISocialNetwork,
} from '../models/user_models';
import db from './db';

/**
 * Parses a JSON object submitted and transforms it into one that conforms to the IUserData interface, if possible.
 *
 * @param submitted_user_data (any) An object that needs to be parsed
 * @param path_id (number) The principal defined in the URL path
 * @returns formatted object, if possible; Error if not
 */
export const parsePutSubmission = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitted_user_data: any,
  path_id: number
): IUserData => {
  let submitted_user: IUserData;

  if (submitted_user_data.id) {
    submitted_user = {
      id: submitted_user_data.id,
    };
  } else {
    throw new BadRequestError(
      'Malformed user object. Must conform to IUserData interface.'
    );
  }

  // test to make sure the path principal ID matches the principal ID in the
  // UserData object that was submitted
  if (submitted_user.id !== path_id) {
    throw new ForbiddenError(
      'Principal ID in IUserData object does not match the principal ID in path.'
    );
  }

  if (
    typeof submitted_user_data.full_name === 'string' &&
    submitted_user_data.full_name !== null &&
    submitted_user_data.full_name.length > 0
  ) {
    submitted_user.full_name = submitted_user_data.full_name;
  } else {
    submitted_user.full_name = '';
  }

  if (
    typeof submitted_user_data.email_address === 'string' &&
    submitted_user_data.email_address !== null &&
    submitted_user_data.email_address.length > 0
  ) {
    submitted_user.email_address = submitted_user_data.email_address;
  } else {
    submitted_user.email_address = '';
  }

  if (
    typeof submitted_user_data.bio === 'string' &&
    submitted_user_data.bio !== null &&
    submitted_user_data.bio.length > 0
  ) {
    submitted_user.bio = submitted_user_data.bio;
  } else {
    submitted_user.bio = '';
  }

  if (
    typeof submitted_user_data.avatar_url === 'string' &&
    submitted_user_data.avatar_url !== null &&
    submitted_user_data.avatar_url.length > 0
  ) {
    submitted_user.avatar_url = submitted_user_data.avatar_url;
  } else {
    submitted_user.avatar_url = '';
  }

  // We don't care about GitHub accounts since we get that information directly
  // from GitHub and not from a PUT request from the user.

  submitted_user.social_profiles = [];

  if (submitted_user_data.social_profiles) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submitted_user_data.social_profiles.forEach((social_profile: any) => {
      let parsed_profile: ISocialProfile;

      if (
        social_profile.network_name !== null &&
        social_profile.user_name !== null &&
        social_profile.public !== null
      ) {
        parsed_profile = {
          network_name: social_profile.network_name,
          user_name: social_profile.user_name,
          profile_url: '',
          public: social_profile.public,
        };

        // WARNING: We will always overwrite whatever is in the email_address
        // field with what we find in social profiles so as to keep email in
        // perfect sync between the two.
        if (social_profile.network_name === 'email') {
          submitted_user.email_address = social_profile.user_name;
        }

        submitted_user.social_profiles.push(parsed_profile);
      } else {
        throw new BadRequestError('Malformed social profile received');
      }
    });
  }

  return submitted_user;
};

/**
 * Compares two objects conforming to the IUserData interface to see if they
 * contain the same data. If they do, no action is performed, and the function
 * returns false. If there is a difference in data, the appropriate function(s)
 * to update the data in the database are called.
 *
 * @param existing_user_data The data for the user as it exists in the database now.
 * @param new_user_data The data we received in an HTTP PUT request from the user.
 */
export const compareAndUpdatePrincipals = async (
  existing_user_data: IUserData,
  new_user_data: IUserData
) => {
  // sanity check to see if we ended up modifying the database at all, in case
  // we wanted to return a different HTTP status for that.
  let modified_data = false;

  // for each element in the IUserData objects, compare to see if it's been updated
  // i.e does existing_user_data.bio == new_user_data.bio and so on

  if (existing_user_data.id !== new_user_data.id) {
    throw new BadRequestError('Principal IDs being compared do not match.');
  }

  if (existing_user_data.bio !== new_user_data.bio) {
    await modifyBio(existing_user_data.id, new_user_data.bio);
    modified_data = true;
  }

  if (existing_user_data.full_name !== new_user_data.full_name) {
    await modifyFullName(existing_user_data.id, new_user_data.full_name);
    modified_data = true;
  }

  if (existing_user_data.avatar_url !== new_user_data.avatar_url) {
    await modifyAvatarURL(existing_user_data.id, new_user_data.avatar_url);
    modified_data = true;
  }

  /* Here's the logic for the next section:
   * 1. Get a list of all possible social networks from the database.
   * 2. For each social network, check the list of social profiles for each
   *    object to see if they have a profile for that network. If they do, save
   *    that ISocialProfile object for comparison later.
   * 3. Once we've run through both lists of social profiles, let's do a check
   *    to see if they match up:
   *    - If a social profile is defined for existing and for new, check to see
   *      if the user name changed.
   *    - If a social profile is defined for new but not for existing, that
   *      means we're adding a social profile.
   *    - If a social profile is defined for existing but not for new, that
   *      means we're deleting a social profile.
   *    - If a social profile is not defined for existing or new, we don't have
   *      to do anything.
   */

  const all_social_networks = await db('social_networks').select<
    ISocialNetwork[]
  >('*');

  // Normally this would be a forEach but that doesn't work well with
  // async/await
  for (const social_network of all_social_networks) {
    const social_network_id = social_network.id;
    const social_network_name = social_network.network_name;

    let existing_user_profile: ISocialProfile | null = null;
    let new_user_profile: ISocialProfile | null = null;

    existing_user_data.social_profiles.forEach((eusp: ISocialProfile) => {
      if (eusp.network_name === social_network_name) {
        existing_user_profile = eusp;
      }
    });

    // If it's not any of the existing social networks, the submitted info
    // *will* be discarded.
    new_user_data.social_profiles.forEach((nusp: ISocialProfile) => {
      if (nusp.network_name === social_network_name) {
        new_user_profile = nusp;
      }
    });

    // Ignore any updates to the GitHub user name since that comes from GitHub
    // and not from a submitted PUT request.
    if (social_network_name === 'GitHub') {
      if (existing_user_profile !== null && new_user_profile !== null) {
        new_user_profile.user_name = existing_user_profile.user_name;
      }
    }

    switch (true) {
      case existing_user_profile !== null && new_user_profile !== null:
        if (
          existing_user_profile.user_name !== new_user_profile.user_name ||
          existing_user_profile.public !== new_user_profile.public
        ) {
          await modifySocialProfile(
            existing_user_data.id,
            social_network_id,
            new_user_profile
          );
          modified_data = true;
          if (social_network_name === 'email') {
            await modifyEmailAddress(
              existing_user_data.id,
              new_user_profile.user_name
            );
            modified_data = true;
          }
        }
        break;
      case existing_user_profile !== null && new_user_profile === null:
        await deleteSocialProfile(existing_user_data.id, social_network_id);
        if (social_network_name === 'email') {
          await modifyEmailAddress(existing_user_data.id, null);
        }
        modified_data = true;
        break;
      case existing_user_profile === null && new_user_profile !== null:
        await addSocialProfile(
          existing_user_data.id,
          social_network_id,
          new_user_profile
        );
        if (social_network_name === 'email') {
          await modifyEmailAddress(
            existing_user_data.id,
            new_user_profile.user_name
          );
        }
        modified_data = true;
        break;
    }
  }

  return modified_data;
};

/**
 * Inserts a new record into the `principal_social` table corresponding to the
 * principal ID, social network ID, and user name from the ISocialProfile
 * object.
 *
 * @param principal_id ID of the principal whose profile is being modified
 * @param social_network_id ID of the social network whose profile we're defining
 * @param social_profile Details of the social profile
 */
export const addSocialProfile = async (
  principal_id: number,
  social_network_id: number,
  social_profile: ISocialProfile
) => {
  let new_user_name = social_profile.user_name;
  if (
    typeof new_user_name !== 'string' ||
    new_user_name === null ||
    new_user_name.length < 1
  ) {
    new_user_name = '';
  }
  return await db('principal_social')
    .insert({
      principal_id: principal_id,
      network_id: social_network_id,
      data: new_user_name,
      public: social_profile.public,
    })
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Modifies a record into the `principal_social` table corresponding to the
 * principal ID, social network ID, and user name from the ISocialProfile
 * object.
 *
 * @param principal_id ID of the principal whose profile is being modified
 * @param social_network_id ID of the social network whose profile we're modifying
 * @param social_profile Details of the social profile
 */
export const modifySocialProfile = async (
  principal_id: number,
  social_network_id: number,
  social_profile: ISocialProfile
) => {
  let new_user_name = social_profile.user_name;
  if (
    typeof new_user_name !== 'string' ||
    new_user_name === null ||
    new_user_name.length < 1
  ) {
    new_user_name = '';
  }
  return await db('principal_social')
    .where({ principal_id: principal_id, network_id: social_network_id })
    .update({ data: new_user_name, public: social_profile.public })
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Removes a record into the `principal_social` table corresponding to the
 * principal ID and social network ID.
 *
 * @param id ID of the principal whose profile is being removing
 * @param social_network_id ID of the social network whose profile we're removing
 */
export const deleteSocialProfile = async (
  id: number,
  social_network_id: number
) => {
  return await db('principal_social')
    .where({ id: id, network_id: social_network_id })
    .del()
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Modifies the bio in the `principals` table for a given principal.
 *
 * @param id ID of the principal who needs a bio modification
 * @param bio The new bio for the user.
 */
export const modifyBio = async (id: number, bio: string) => {
  let new_bio = bio;
  if (typeof new_bio !== 'string' || new_bio === null || new_bio.length < 1) {
    new_bio = '';
  }
  return await db('principals')
    .where({ id: id })
    .update({ bio: new_bio })
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Modifies the full name in the `principals` table for a given principal.
 *
 * @param id ID of the principal who needs a bio modification
 * @param full_name The new full name for the user.
 */
export const modifyFullName = async (id: number, full_name: string) => {
  let new_full_name = full_name;
  if (
    typeof new_full_name !== 'string' ||
    new_full_name === null ||
    new_full_name.length < 1
  ) {
    new_full_name = '';
  }
  return await db('principals')
    .where({ id: id })
    .update({ full_name: new_full_name })
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Modifies the avatar URL in the `principals` table for a given principal.
 *
 * @param id ID of the principal who needs a bio modification
 * @param avatar_url The new avatar URL for the user.
 */
export const modifyAvatarURL = async (id: number, avatar_url: string) => {
  let new_avatar_url = avatar_url;
  if (
    typeof new_avatar_url !== 'string' ||
    new_avatar_url === null ||
    new_avatar_url.length < 1
  ) {
    new_avatar_url = '';
  }
  return await db('principals')
    .where({ id: id })
    .update({ avatar_url: new_avatar_url })
    .then(returned_rows => {
      return returned_rows;
    });
};

/**
 * Modifies the email address in the `principals` table for a given principal.
 * It only needs to update `principals` because `principal_social` should
 * already have been updated.
 *
 * @param id ID of the principal who needs a bio modification
 * @param bio The new bio for the user.
 */
export const modifyEmailAddress = async (id: number, email_address: string) => {
  let new_email_address = email_address;
  if (
    typeof new_email_address !== 'string' ||
    new_email_address === null ||
    new_email_address.length < 1
  ) {
    new_email_address = '';
  }
  return await db('principals')
    .where({ id: id })
    .update({ email_address: new_email_address })
    .then(returned_rows => {
      return returned_rows;
    });
};
