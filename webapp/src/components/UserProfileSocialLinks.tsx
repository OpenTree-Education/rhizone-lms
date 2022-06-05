import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { SocialProfile } from '../types/api';

import RedditIcon from '@mui/icons-material/Reddit';
import MailIcon from '@mui/icons-material/Mail';

interface UserProfileSocialLinksProps {
  profileList: SocialProfile[] | undefined;
}

const renderGitHubProfileLink = (social_profile: SocialProfile): JSX.Element => {
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="GitHub">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <GitHubIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderLinkedInProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="LinkedIn">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <LinkedInIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderTwitterProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Twitter">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <TwitterIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderRedditProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Reddit">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <RedditIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderWebsiteLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Website">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <LanguageIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderDribbbleProfileLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="Dribbble">
      <IconButton component="a" href={social_profile.profile_url} target="_blank">
        <SportsBasketballIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const renderEmailLink = (social_profile: SocialProfile): JSX.Element | void => {
  if (social_profile.public === false) {
    return;
  }
  return <Grid item key={social_profile.profile_url}>
    <Tooltip title="email">
      <IconButton component="a" href={social_profile.profile_url}>
        <MailIcon color="primary" />
      </IconButton>
     </Tooltip>
  </Grid>
}

const UserProfileSocialLinks = ({
  profileList
}: UserProfileSocialLinksProps): JSX.Element => {
  if (!profileList) {
    return <></>;
  }
  return (<>
    {profileList.map((social_profile: SocialProfile) => {
      switch (social_profile.network_name) {
        case "GitHub":
          return renderGitHubProfileLink(social_profile);
        case "LinkedIn":
          return renderLinkedInProfileLink(social_profile);
        case "Twitter":
          return renderTwitterProfileLink(social_profile);
        case "Reddit":
          return renderRedditProfileLink(social_profile);
        case "website":
          return renderWebsiteLink(social_profile);
        case "Dribbble":
          return renderDribbbleProfileLink(social_profile);
        case "email":
          return renderEmailLink(social_profile);
        default:
          return <a key={social_profile.profile_url} href={social_profile.profile_url}>{social_profile.network_name}</a>
      }
    })}
  </>);
}

export default UserProfileSocialLinks;
