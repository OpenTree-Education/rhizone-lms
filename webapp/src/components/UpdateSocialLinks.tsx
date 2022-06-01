import React, { useState } from 'react';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  IconButton,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import ClearIcon from '@mui/icons-material/Clear';

interface SocialLinksProps {
  socialName: string;
  networkData: string;
  setSocialNetworkList: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        network_name: string;
        protocol: string;
        base_url: string;
        data: string;
      }[]
    >
  >;
  networkId: number;
}

const UpdateSocialLinks = ({
  socialName,
  networkData,
  setSocialNetworkList,
  networkId,
}: SocialLinksProps) => {
  const [socialNetworks, setSocialNetworks] = useState(socialName);

  const handleChange = (event: SelectChangeEvent) => {
    setSocialNetworks(event.target.value);
  };

  function removeItem() {
    setSocialNetworkList(prevState =>
      prevState.filter(network => network.id !== networkId)
    );
  }

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
          <MenuItem value="linkedin">
            <LinkedInIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                mr: 1,
              }}
            />
            LinkedIn
          </MenuItem>
          <MenuItem value="website">
            <LanguageIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                mr: 1,
              }}
            />
            Website
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        type="text"
        name={socialNetworks}
        value={networkData}
        variant="standard"
      />
      <IconButton component="button">
        <ClearIcon color="primary" onClick={removeItem} />
      </IconButton>
    </Grid>
  );
};
export default UpdateSocialLinks;
