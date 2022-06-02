import { IUserData, ISocialProfile } from '../models/user_models';
import db from './db';

/**
 * 
 * @param existing_user_data 
 * @param new_user_data 
 */
const compareAndUpdatePrincipals = (existing_user_data: IUserData, new_user_data: IUserData) => {
  // for each element in the IUserData objects, compare to see if it's been updated
  // ie does existing_user_data.bio == new_user_data.bio and so on

  // make sure to disregard any changes that are meaningless, like if
  // existing_user_data.bio is "" and new_user_data.bio is 'undefined', don't worry about it

  // for each change, call the appropriate function that updates the database information
}

/**
 * 
 * @param principal_id 
 * @param social_profile 
 */
const addSocialProfile = (principal_id: number, social_profile: ISocialProfile) => {

}

/**
 * 
 * @param principal_id 
 * @param social_profile 
 */
const modifySocialProfile = (principal_id: number, social_profile: ISocialProfile) => {
  
}

/**
 * 
 * @param principal_id 
 * @param social_profile 
 */
const deleteSocialProfile = (principal_id: number, social_profile: ISocialProfile) => {

}

/**
 * 
 * @param principal_id 
 * @param bio 
 */
const modifyBio = (principal_id: number, bio: string) => {
  
}

/**
 * 
 * @param principal_id 
 * @param full_name 
 */
const modifyFullName = (principal_id: number, full_name: string) => {
  
}

/**
 * 
 * @param principal_id 
 * @param avatar_url 
 */
const modifyAvatarURL = (principal_id: number, avatar_url: string) => {

}

/**
 * 
 * @param principal_id 
 * @param avatar_url 
 */
const modifyEmailAddress = (principal_id: number, avatar_url: string) => {

}
