import React, { useState } from 'react';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';

interface SocialLinksProps {
  socialName: string;
  networkData: string;
}

const UpdateSocialLinks = ({ socialName, networkData }: SocialLinksProps) => {
  const [socialNetworks, setSocialNetworks] = useState(socialName);

  const handleChange = (event: SelectChangeEvent) => {
    setSocialNetworks(event.target.value);
  };

  return (
    <Grid
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        mb: 4,
      }}
    >
      <FormControl
        variant="standard"
        sx={{
          m: 1,
          minWidth: 150,
        }}
      >
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={socialNetworks}
          onChange={handleChange}
          label="Social Networks"
        >
          <MenuItem value="twitter">
            <TwitterIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                mr: 1,
              }}
            />
            Twitter
          </MenuItem>
          <MenuItem value="linkedIn">
            <LinkedInIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                mr: 1,
              }}
            />
            LinkedIn
          </MenuItem>
          <MenuItem value="portfolio">
            <LanguageIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                mr: 1,
              }}
            />
            Portfolio
          </MenuItem>
        </Select>
      </FormControl>
      <TextField type="text" name={socialNetworks} variant="standard" />
    </Grid>
  );
};
export default UpdateSocialLinks;
