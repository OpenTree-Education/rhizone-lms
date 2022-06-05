import React from 'react';
import { SocialNetwork, SocialProfile, UserData } from '../types/api';

interface UserProfileEditingFormProps {
  networksList: SocialNetwork[] | null;
  userData: UserData | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  updateUserFunction: React.MouseEventHandler<HTMLInputElement>;
}

let user_data: UserData | undefined;
let set_user_data: React.Dispatch<React.SetStateAction<UserData>>;

const generateNetworkDropdown = (networksList: SocialNetwork[] | null, row_number: number, social_profile: SocialProfile) => {
  const network_options = networksList?.map((social_network) => {
    return <option value={social_network.network_name} key={`row_${row_number}_select_option_${social_network.id}`} >{social_network.network_name}</option>
  });

  return <select defaultValue={social_profile.network_name} key={`row_${row_number}_select`}>{network_options}</select>
}

const updateDataFromForm = (change_event: React.ChangeEvent<HTMLInputElement>) => {
  if (typeof user_data !== "undefined") {
    const new_user_data = user_data;
    console.log(change_event.target.value);
    new_user_data.full_name = change_event.target.value;
    set_user_data(new_user_data);
  }
}

const UserProfileEditingForm = ({networksList, userData, setUserData, updateUserFunction}: UserProfileEditingFormProps): JSX.Element => {
  const profileList = userData?.social_profiles;
  user_data = userData;
  set_user_data = setUserData;
  const socialFormRows = profileList?.map((social_profile: SocialProfile, row_number: number) => {
    return <div key={`row_${row_number}`}>
      <>
        { generateNetworkDropdown(networksList, row_number, social_profile) }
      </>
      <><input type="text" key={`row_${row_number}_input`} defaultValue={social_profile.user_name}/></>
      <><label><input key={`row_${row_number}_checkbox`} type="checkbox" defaultChecked={social_profile.public} />Visible?</label></>
    </div>;
  });
  return <form>
    <label>Full name: <input type="text" defaultValue={userData?.full_name} onBlur={updateDataFromForm} /></label>
    <hr />
    <fieldset>
      <legend>Social Profiles:</legend>
      {socialFormRows}
    </fieldset>
    <hr />
    <input type="submit" onClick={updateUserFunction} value="Submit Edits" />
  </form>;
}

export default UserProfileEditingForm;
