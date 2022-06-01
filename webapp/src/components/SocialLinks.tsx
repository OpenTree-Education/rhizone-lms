import React, { useState } from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import UpdateSocialLinks from './UpdateSocialLinks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';

interface SocialLinksProps {
  isEditable: boolean;
}

const networkData = [
  {
    id: 1,
    network_name: 'github',
    protocol: '//',
    base_url: 'github.com/',
    data: 'matthew_morenez',
  },
  {
    id: 2,
    network_name: 'website',
    protocol: '//',
    base_url: '',
    data: 'example.com',
  },
  {
    id: 3,
    network_name: 'linkedin',
    protocol: '//',
    base_url: 'linkedin.com/in/',
    data: 'matthew_morenez',
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
      { id: 4, network_name: '', protocol: '//', base_url: '', data: '' },
    ]);
  }

  return (
    <>
      {socialNetworkList.map((network, i) => {
        if (network.network_name === 'github') {
          return !isEditable ? (
            <Grid item xs={isEditable ? 6 : 1} key={network.id}>
              <Tooltip title="GitHub">
                <IconButton
                  component="a"
                  sx={{ mr: 1 }}
                  href={network.protocol + network.base_url + network.data}
                >
                  <GitHubIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (
            <Grid item xs={isEditable ? 10 : 1} display="flex" key={network.id}>
              <GitHubIcon color="primary" sx={{ m: 1 }} />
              <TextField disabled variant="standard" value={network.data} />
            </Grid>
          );
        } else {
          return !isEditable ? (
            <Grid item xs={isEditable ? 10 : 1} key={network.id}>
              <Tooltip title={network.network_name}>
                <IconButton
                  component="a"
                  sx={{ mr: 1 }}
                  href={network.protocol + network.base_url + network.data}
                >
                  {(socialNetworkIcons as any)[network.network_name]}
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (
            <UpdateSocialLinks
              key={network.id}
              socialName={network.network_name}
              networkData={network.data}
              networkId={network.id}
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
