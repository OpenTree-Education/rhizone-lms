import React from 'react';
import {
  Tooltip,
  IconButton,
  Stack,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import RedditIcon from '@mui/icons-material/Reddit';
import MailIcon from '@mui/icons-material/Mail';

import { SocialNetwork, SocialProfile } from '../types/api';

interface SocialProfileListProps {
  editingMode: boolean;
  socialNetworksList: SocialNetwork[] | null;
  socialProfilesList: SocialProfile[] | undefined;
  updateProfileFunction: (socialProfile: SocialProfile) => void;
}

interface SocialProfileLinkProps {
  socialProfile: SocialProfile;
}

const SocialProfileLink = (props: SocialProfileLinkProps) => {
  if (props.socialProfile.public === false) {
    return null;
  }
  switch (props.socialProfile.network_name) {
    case 'GitHub':
      return (
        <Tooltip title="GitHub">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <GitHubIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    case 'LinkedIn':
      return (
        <Tooltip title="LinkedIn">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <LinkedInIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    case 'Twitter':
      return (
        <Tooltip title="Twitter">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <TwitterIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    case 'Reddit':
      return (
        <Tooltip title="Reddit">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <RedditIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    case 'Dribbble':
      return (
        <Tooltip title="Dribbble">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <SportsBasketballIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    case 'email':
      return (
        <Tooltip title="email">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <MailIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
    default:
      return (
        <Tooltip title="Website">
          <IconButton
            component="a"
            href={props.socialProfile.profile_url}
            target="_blank"
          >
            <LanguageIcon color="primary" />
          </IconButton>
        </Tooltip>
      );
  }
};

interface SocialProfileFormProps {
  socialNetwork: SocialNetwork;
  socialProfilesList: SocialProfile[] | undefined;
  updateProfileFunction: (socialProfile: SocialProfile) => void;
}

const SocialProfileForm = (props: SocialProfileFormProps) => {
  let matching_profile: SocialProfile = {
    network_name: props.socialNetwork.network_name,
    user_name: '',
    profile_url: '',
    public: false,
  };

  if (props.socialProfilesList) {
    props.socialProfilesList.forEach(social_profile => {
      if (props.socialNetwork.network_name === social_profile.network_name) {
        matching_profile = social_profile;
      }
    });
  }

  return (
    <Stack direction="row" spacing={2}>
      <>
        <p>{props.socialNetwork.network_name}:</p>
      </>
      <TextField
        label="Username"
        value={matching_profile.user_name}
        onChange={event => {
          matching_profile.user_name = event.target.value;
          props.updateProfileFunction(matching_profile);
        }}
        disabled={matching_profile.network_name === 'GitHub'}
      />
      {matching_profile.user_name !== '' ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={matching_profile.public}
              onChange={event => {
                matching_profile.public = event.target.checked;
                props.updateProfileFunction(matching_profile);
              }}
            />
          }
          label="Visible?"
        />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export const SocialProfileList = (props: SocialProfileListProps) => {
  let profileIconLinks: JSX.Element[] = [];
  let profileFormElements: JSX.Element[] = [];

  if (
    props.socialNetworksList === null ||
    props.socialProfilesList === null ||
    props.socialProfilesList === undefined
  ) {
    return <></>;
  }

  if (props.editingMode === true) {
    profileFormElements = [];
    props.socialNetworksList.forEach((social_network, index) => {
      profileFormElements.push(
        <SocialProfileForm
          key={`form_${index}`}
          socialNetwork={social_network}
          socialProfilesList={props.socialProfilesList}
          updateProfileFunction={props.updateProfileFunction}
        />
      );
    });
    return (
      <Stack direction="column" spacing={2}>
        {profileFormElements}
      </Stack>
    );
  } else {
    profileIconLinks = [];
    props.socialProfilesList.forEach((socialProfile: SocialProfile, index) => {
      profileIconLinks.push(
        <SocialProfileLink
          key={`link_${index}`}
          socialProfile={socialProfile}
        />
      );
    });
    return <Stack direction="row">{profileIconLinks}</Stack>;
  }
};
