import React from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import UpdateSocialLinks from './UpdateSocialLinks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

interface SocialLinksProps {
  isEditable: boolean;
  github: string;
  linkedIn: string;
  website: string;
}

const SocialLinks = ({
  isEditable,
  github,
  linkedIn,
  website,
}: SocialLinksProps) => {
  return (
    <>
      {!isEditable ? (
        <Grid item xs={isEditable ? 6 : 1}>
          <Tooltip title="GitHub">
            <IconButton component="a" sx={{ mr: 1 }} href={github}>
              <GitHubIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : (
        <Grid item xs={isEditable ? 10 : 1} display="flex">
          <GitHubIcon color="primary" sx={{ m: 1 }} />
          <TextField disabled variant="standard" value={github} />
        </Grid>
      )}
      {!isEditable ? (
        <Grid item xs={isEditable ? 10 : 1}>
          <Tooltip title="LinkedIn">
            <IconButton component="a" sx={{ mr: 1 }} href={linkedIn}>
              <LinkedInIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : (
        <UpdateSocialLinks socialName={'liknedIn'} networkData={linkedIn} />
      )}
      {!isEditable ? (
        <Grid item xs={isEditable ? 10 : 1}>
          <Tooltip title="Portfolio">
            <IconButton component="a" sx={{ mr: 1 }} href={website}>
              <LanguageIcon color="primary" />
            </IconButton>
          </Tooltip>
        </Grid>
      ) : (
        <UpdateSocialLinks socialName="website" networkData={website} />
      )}
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
