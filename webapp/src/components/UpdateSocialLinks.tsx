import React from 'react';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import ClearIcon from '@mui/icons-material/Clear';
import { SocialNetwork } from '../types/api';

interface SocialLinksProps {
  socialName: string;
  networkData: string;
  setSocialNetworkList: React.Dispatch<React.SetStateAction<SocialNetwork[]>>;
}

const UpdateSocialLinks = ({
  socialName,
  networkData,
  setSocialNetworkList,
}: SocialLinksProps) => {
  const handleNetworkNameChange = (event: SelectChangeEvent) => {
    setSocialNetworkList(prevState => {
      const socialNetworkToChange = prevState.find(
        network => network.user_name === networkData
      );

      const newSocialNetwork = {
        ...socialNetworkToChange,
        network_name: event.target.value,
      };

      const indexToChange: number = prevState.findIndex(
        network => network === socialNetworkToChange
      );
      const newState = [...prevState];
      newState.splice(indexToChange, 1, newSocialNetwork as SocialNetwork);
      return newState;
    });
  };

  function removeItem() {
    setSocialNetworkList(prevState =>
      prevState.filter(network => network.network_name !== socialName)
    );
  }

  function handleNetworkDataChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSocialNetworkList(prevState => {
      const socialNetworkToChange = prevState.find(
        network => network.network_name === socialName
      );

      const newSocialNetwork = {
        ...socialNetworkToChange,
        user_name: event.target.value,
      };

      const indexToChange: number = prevState.findIndex(
        network => network === socialNetworkToChange
      );
      const newState = [...prevState];
      newState.splice(indexToChange, 1, newSocialNetwork as SocialNetwork);
      return newState;
    });
  }

  return (
    <Grid
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        mb: 4,
        ml: -1,
        mt: 2,
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
          value={socialName}
          onChange={handleNetworkNameChange}
          label="Social Networks"
        >
          <MenuItem value="twitter">
            <TwitterIcon
              color="primary"
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                mr: 1,
                mb: '-7px',
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
                mb: '-7px',
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
                mb: '-7px',
              }}
            />
            Website
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        type="text"
        name={socialName}
        value={networkData}
        variant="standard"
        onChange={handleNetworkDataChange}
      />
      <Tooltip title="Remove">
        <IconButton component="button">
          <ClearIcon color="primary" onClick={removeItem} />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
export default UpdateSocialLinks;
