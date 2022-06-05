import React from 'react';
import { SocialNetwork, SocialProfile } from '../types/api';

interface UserProfileEditingFormProps {
  networksList: SocialNetwork[] | null;
  profileList: SocialProfile[] | undefined;
  updateUserFunction: React.MouseEventHandler<HTMLButtonElement>;
}

const generateNetworkDropdown = (networksList: SocialNetwork[] | null, row_number: number, social_profile: SocialProfile) => {
  const network_options = networksList?.map((social_network) => {
    return <option value={social_network.network_name} key={`row_${row_number}_select_option_${social_network.id}`} >{social_network.network_name}</option>
  });

  return <select value={social_profile.network_name} key={`row_${row_number}_select`}>{network_options}</select>
}

const UserProfileEditingForm = ({networksList, profileList, updateUserFunction}: UserProfileEditingFormProps): JSX.Element => {
  const formRows = profileList?.map((social_profile: SocialProfile, row_number: number) => {
    return <div key={`row_${row_number}`}>
      <>
        { generateNetworkDropdown(networksList, row_number, social_profile) }
      </>
      <><input type="text" key={`row_${row_number}_input`} value={social_profile.user_name}/></>
      <><label><input key={`row_${row_number}_checkbox`} type="checkbox" checked={social_profile.public} />Visible?</label></>
    </div>;
  });
  return <form>
    <button onClick={updateUserFunction}>Change My Name to Something Else</button>
    <hr />
    {formRows}
  </form>;
}

export default UserProfileEditingForm;
