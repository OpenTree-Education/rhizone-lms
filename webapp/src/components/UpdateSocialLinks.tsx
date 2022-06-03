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
import RedditIcon from '@mui/icons-material/Reddit';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailIcon from '@mui/icons-material/Mail';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import TwitterIcon from '@mui/icons-material/Twitter';
import ClearIcon from '@mui/icons-material/Clear';
import { SocialNetwork, SocialProfile } from '../types/api';
import useApiData from '../helpers/useApiData';

interface SocialLinksProps {
  socialName: string;
  networkData: string;
  setSocialNetworkList: React.Dispatch<React.SetStateAction<SocialProfile[]>>;
}

interface SocialNetworkIcon {
  github: JSX.Element;
  linkedin: JSX.Element;
  website: JSX.Element;
  twitter: JSX.Element;
  reddit: JSX.Element;
  dribbble: JSX.Element;
  email: JSX.Element;
}

const socialNetworkIcons: SocialNetworkIcon = {
  github: (
    <GitHubIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  linkedin: (
    <LinkedInIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  website: (
    <LanguageIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  twitter: (
    <TwitterIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  reddit: (
    <RedditIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  dribbble: (
    <SportsBasketballIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
  email: (
    <MailIcon
      color="primary"
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        mr: 1,
        mb: '-7px',
      }}
    />
  ),
};

const UpdateSocialLinks = ({
  socialName,
  networkData,
  setSocialNetworkList,
}: SocialLinksProps) => {
  const { data: socialNetworkOptions, error } = useApiData<SocialNetwork[]>({
    deps: [socialName],
    path: `/social_networks`,
    sendCredentials: true,
  });

  if (error) {
    return <p>There was an error loading the social network options.</p>;
  }

  if (!socialNetworkOptions) {
    return null;
  }

  /**
   * Changes network_name based on the value selected by drop down menu
   *
   * @param event - the event that we receive from drop down menu
   *
   * @privateRemarks
   * Finds the item in social Network list array through the user_name (which is not ideal way)
   *
   */

  const handleNetworkNameChange = (event: SelectChangeEvent) => {
    setSocialNetworkList(prevState => {
      const socialNetworkToChange = prevState.find(
        network => network.network_name === networkData
      );

      const newSocialNetwork = {
        ...socialNetworkToChange,
        network_name: event.target.value,
      };

      const indexToChange: number = prevState.findIndex(
        network => network === socialNetworkToChange
      );
      const newState = [...prevState];
      newState.splice(indexToChange, 1, newSocialNetwork as SocialProfile);
      return newState;
    });
  };

  /**
   * Remove social network field from social network list
   *
   */

  function removeItem() {
    setSocialNetworkList(prevState =>
      prevState.filter(network => network.network_name !== socialName)
    );
  }

  /**
   * Changes user name based on the value that typed into the input field
   *
   * @param event - the event that we receive from input field change
   *
   * @privateRemarks
   * Finds the item in social Network list array through the network_name and update (which is not ideal way)
   *
   */

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
      newState.splice(indexToChange, 1, newSocialNetwork as SocialProfile);
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
          {socialNetworkOptions.map(network => {
            if (network.network_name !== 'github') {
              return (
                <MenuItem value={network.network_name} key={network.id}>
                  {(socialNetworkIcons as any)[network.network_name]}
                  {network.network_name}
                </MenuItem>
              );
            }
          })}
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
        <IconButton component="button" onClick={removeItem}>
          <ClearIcon color="primary" />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};
export default UpdateSocialLinks;
