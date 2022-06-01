import React, { useState } from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import UpdateSocialLinks from './UpdateSocialLinks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

interface SocialLinksProps {
  isEditable: boolean;
}

const networkData = [
  {
    network_name: 'github',
    protocol: '//',
    base_url: 'github.com/',
    data: 'matthew_morenez',
  },
  {
    network_name: 'website',
    protocol: '//',
    base_url: '',
    data: 'example.com',
  },
  {
    network_name: 'linkedin',
    protocol: '//',
    base_url: 'linkedin.com/in/',
    data: 'matthew_morenez',
  },
];

const SocialLinks = ({ isEditable }: SocialLinksProps) => {
  const [socialNetworkList, setSocialNetworkList] = useState(networkData);

  return (
    <>
      {socialNetworkList.map((network, i) => {
        if (network.network_name == 'github') {
          return !isEditable ? (
            <Grid item xs={isEditable ? 6 : 1}>
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
            <Grid item xs={isEditable ? 10 : 1} display="flex">
              <GitHubIcon color="primary" sx={{ m: 1 }} />
              <TextField disabled variant="standard" value={network.data} />
            </Grid>
          );
        } else {
          return !isEditable ? (
            <Grid item xs={isEditable ? 10 : 1}>
              <Tooltip title={network.network_name}>
                <IconButton
                  component="a"
                  sx={{ mr: 1 }}
                  href={network.protocol + network.base_url + network.data}
                >
                  <LinkedInIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          ) : (
            <UpdateSocialLinks
              socialName={network.network_name}
              networkData={network.data}
            />
          );
        }
      })}
      <Grid item xs={isEditable ? 10 : 1}>
        {isEditable && (
          <Button component="button" variant="contained">
            Add a Network
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SocialLinks;
