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

  // test to make sure the path principal ID matches the principal ID in the UserData object that was submitted
  if (submitted_user.id !== path_id) {
    throw new ForbiddenError(
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
  let modified_data = false;

  // for each element in the IUserData objects, compare to see if it's been updated
  // i.e does existing_user_data.bio == new_user_data.bio and so on

  if (existing_user_data.id !== new_user_data.id) {
    throw new BadRequestError('Principal IDs being compared do not match.');
  }

  if (existing_user_data.bio !== new_user_data.bio) {
    modifyBio(existing_user_data.id, new_user_data.bio);
    modified_data = true;
  }

  if (existing_user_data.full_name !== new_user_data.full_name) {
    modifyFullName(existing_user_data.id, new_user_data.full_name);
    modified_data = true;
  }

  if (existing_user_data.email_address !== new_user_data.email_address) {
    modifyEmailAddress(existing_user_data.id, new_user_data.email_address);
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

  all_social_networks.forEach((social_network: ISocialNetwork) => {
    const social_network_id = social_network.id;
    const social_network_name = social_network.network_name;

    let existing_user_profile: ISocialProfile | null = null;
    let new_user_profile: ISocialProfile | null = null;

    existing_user_data.social_profiles.forEach((eusp: ISocialProfile) => {
      if (eusp.network_name == social_network_name) {
        existing_user_profile = eusp;
      }
    });

    new_user_data.social_profiles.forEach((nusp: ISocialProfile) => {
      if (nusp.network_name == social_network_name) {
        new_user_profile = nusp;
      }
    });

    switch (true) {
      case existing_user_profile !== null && new_user_profile !== null:
        if (existing_user_profile.user_name != new_user_profile.user_name) {
          modifySocialProfile(
            existing_user_data.id,
            social_network_id,
            new_user_profile
          );
        }
        if (social_network_name == 'email') {
          modifyEmailAddress(existing_user_data.id, new_user_profile.user_name);
        }
        modified_data = true;
        break;
      case existing_user_profile !== null && new_user_profile === null:
        deleteSocialProfile(existing_user_data.id, social_network_id);
        if (social_network_name == 'email') {
          modifyEmailAddress(existing_user_data.id, null);
        }
        modified_data = true;
        break;
      case existing_user_profile === null && new_user_profile !== null:
        addSocialProfile(
          existing_user_data.id,
          social_network_id,
          new_user_profile
        );
        if (social_network_name == 'email') {
          modifyEmailAddress(existing_user_data.id, new_user_profile.user_name);
        }
        modified_data = true;
        break;
    }
  });

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
  return await db('principal_social').insert({
    principal_id: principal_id,
    network_id: social_network_id,
    data: social_profile.user_name,
    public: social_profile.public,
  })
  .then((returned_rows) => {
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
  return await db('principal_social')
    .where({ principal_id: principal_id, network_id: social_network_id })
    .update({ data: social_profile.user_name })
    .then((returned_rows) => {
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
    .then((returned_rows) => {
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
  return await db('principals').where({ id: id }).update({ bio: bio })
  .then((returned_rows) => {
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
  return await db('principals').where({ id: id }).update({ full_name: full_name })
  .then((returned_rows) => {
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
  return await db('principals').where({ id: id }).update({ avatar_url: avatar_url })
  .then((returned_rows) => {
    return returned_rows;
  });
};

/**
 * Modifies the email address in the `principals` table for a given principal.
 *
 * @param id ID of the principal who needs a bio modification
 * @param bio The new bio for the user.
 */
export const modifyEmailAddress = async (id: number, email_address: string) => {
  // TODO: Check social network
  return await db('principals')
    .where({ id: id })
    .update({ email_address: email_address })
    .then((returned_rows) => {
      return returned_rows;
    });
};
