import React, { useState } from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import UpdateSocialLinks from './UpdateSocialLinks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SocialNetwork } from '../types/api';

interface SocialLinksProps {
  isEditable: boolean;
}

const networkData: SocialNetwork[] = [
  {
    network_name: 'github',
    profile_url: '//github.com/matthew_morenez',
    user_name: 'matthew_morenez',
    public: true,
  },
  {
    network_name: 'website',
    profile_url: '//example.com',
    user_name: 'example.com',
    public: true,
  },
  {
    network_name: 'linkedin',
    profile_url: '//linkedin.com/in/matthew_morenez',
    user_name: 'matthew_morenez',
    public: true,
  },
];

interface SocialNetworkIcon {
  github: JSX.Element;
  linkedin: JSX.Element;
  website: JSX.Element;
  twitter: JSX.Element;
}

const socialNetworkIcons: SocialNetworkIcon = {
  github: <GitHubIcon color="primary" />,
  linkedin: <LinkedInIcon color="primary" />,
  website: <LanguageIcon color="primary" />,
  twitter: <TwitterIcon color="primary" />,
};

const SocialLinks = ({ isEditable }: SocialLinksProps) => {
  const [socialNetworkList, setSocialNetworkList] = useState(networkData);

  function handleAddButtonClick() {
    setSocialNetworkList(prevState => [
      ...prevState,
      { network_name: '', profile_url: '', public: true, user_name: '' },
    ]);
  }

  return (
    <>
      {socialNetworkList.map(network => {
        if (network.network_name === 'github') {
          return !isEditable ? (
            <Grid item key={network.network_name}>
              <Tooltip title="GitHub">
                <IconButton component="a" href={network.profile_url}>
                  <GitHubIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (
            <Grid
              item
              xs={isEditable ? 10 : 1}
              ml={{ md: -3, sm: -1, xs: -3 }}
              display="flex"
              justifyContent="flex-start"
              alignItems="flex-start"
              key={network.network_name}
            >
              <GitHubIcon color="primary" sx={{ ml: 3, mr: 1 }} />
              <TextField
                disabled
                variant="standard"
                value={network.user_name}
              />
            </Grid>
          );
        } else {
          return !isEditable ? (
            <Grid item xs={isEditable ? 10 : 1} key={network.network_name}>
              <Tooltip title={network.network_name}>
                <IconButton
                  component="a"
                  sx={{ mr: 1 }}
                  href={network.profile_url}
                >
                  {(socialNetworkIcons as any)[network.network_name]}
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (
            <UpdateSocialLinks
              key={network.network_name}
              socialName={network.network_name}
              networkData={network.user_name}
              setSocialNetworkList={setSocialNetworkList}
            />
          );
        }
      })}
      <Grid item xs={isEditable ? 10 : 1}>
        {isEditable && socialNetworkList.length <= 5 && (
          <Button
            component="button"
            variant="contained"
            onClick={handleAddButtonClick}
          >
            Add a Network
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SocialLinks;
