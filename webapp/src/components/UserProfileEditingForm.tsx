import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import React from 'react';
import { SocialNetwork, SocialProfile, UserData } from '../types/api';

interface UserProfileEditingFormProps {
  networksList: SocialNetwork[] | null;
  userData: UserData | undefined;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const modifyUser = (
  event: React.ChangeEvent<HTMLInputElement>,
  input_object: SocialProfile,
  user_data: UserData | undefined,
  set_user_data: React.Dispatch<React.SetStateAction<UserData>>
) => {
  const new_user: UserData = {
    id: user_data?.id || -1,
    bio: user_data?.bio || '',
    full_name: user_data?.full_name || '',
    avatar_url: user_data?.avatar_url || '',
    github_accounts: user_data?.github_accounts || [],
    social_profiles: user_data?.social_profiles || [],
  };
  if (new_user.social_profiles) {
    new_user.social_profiles.forEach(social_profile => {
      if (social_profile.network_name === input_object.network_name) {
        social_profile.public = !input_object.public;
      }
    });
  }
  set_user_data(new_user);
};

const generateNetworkDropdown = (
  userData: UserData | undefined,
  networksList: SocialNetwork[] | null,
  row_number: number,
  social_profile: SocialProfile
) => {
  const network_options = networksList?.map(social_network => {
    return (
      <MenuItem
        value={social_network.network_name}
        key={`row_${row_number}_select_option_${social_network.id}`}
      >
        {social_network.network_name}
      </MenuItem>
    );
  });

  return (
    <Select
      value={social_profile.network_name}
      key={`row_${row_number}_select`}
      disabled={social_profile.network_name === 'GitHub'}
    >
      {network_options}
    </Select>
  );
};

const UserProfileEditingForm = ({
  networksList,
  userData,
  setUserData,
}: UserProfileEditingFormProps): JSX.Element => {
  const profileList = userData?.social_profiles;
  const socialFormRows = profileList?.map(
    (social_profile: SocialProfile, row_number: number) => {
      return (
        <Stack direction="row" spacing={2} key={`row_${row_number}`}>
          {generateNetworkDropdown(
            userData,
            networksList,
            row_number,
            social_profile
          )}
          <TextField
            label="Username"
            key={`row_${row_number}_input`}
            value={social_profile.user_name}
            disabled={social_profile.network_name === 'GitHub'}
          ></TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={social_profile.public}
                onChange={event => {
                  modifyUser(event, social_profile, userData, setUserData);
                }}
              />
            }
            label="Visible?"
          />
        </Stack>
      );
    }
  );
  return (
    <fieldset>
      <legend>Social Profiles:</legend>
      {socialFormRows}
    </fieldset>
  );
};

export default UserProfileEditingForm;
