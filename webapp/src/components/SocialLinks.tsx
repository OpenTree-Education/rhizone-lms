import React, { useState } from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import UpdateSocialLinks from './UpdateSocialLinks';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SocialNetwork, SocialProfile, UserData } from '../types/api';
import useApiData from '../helpers/useApiData';

interface SocialLinksProps {
  isEditable: boolean;
}

/**
 *
 * @privateRemarks
 *
 * dummydata that we hardcoded
 */
// const networkData: SocialNetwork[] = [
//   {
//     network_name: 'github',
//     profile_url: '//github.com/matthew_morenez',
//     user_name: 'matthew_morenez',
//     public: true,
//   },
//   {
//     network_name: 'website',
//     profile_url: '//example.com',
//     user_name: 'example.com',
//     public: true,
//   },
//   {
//     network_name: 'linkedin',
//     profile_url: '//linkedin.com/in/matthew_morenez',
//     user_name: 'matthew_morenez',
//     public: true,
//   },
// ];

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
<<<<<<< HEAD
  const [socialNetworkList, setSocialNetworkList] = useState(socialNetworkIcons);
=======
  const [socialNetworkList, setSocialNetworkList] =
    useState<SocialProfile[]>(networkData);

  // const [socialProfile, setSocialProfile] = useState<SocialProfile[]>([]);

  // const { data: socialNetworks, error } = useApiData<UserData[]>({
  //   deps: [socialNetworkList],
  //   path: `/profile/1`,
  //   sendCredentials: true,
  // });
  // if (error) {
  //   return <p>There was an error loading the social network.</p>;
  // }
  // if (!socialNetworks) {
  //   return null;
  // } else {
  //   setSocialProfile(socialNetworks[0].social_profiles);
  // }

  // We need to retrieve a list of all possible social networks

  // We need to retrieve the UserData object from the API

  // We need to select the SocialProfile[] list from the UserData object

  // for each row in the SocialProfile[] list, we need to

  // render the correct icon, linked to the profile_url of the SocialProfile

  // when we hit the edit button, each of these buttons should turn into:

  // form row with three components:
  // - a drop-down list of [all possible social networks] with the one selected corresponding to the social network of that socialprofile
  // - the user_name of the socialprofile
  // - a checkbox linked to public visibility of the socialprofile
>>>>>>> 0258a4223b8cebf2990d759ecf3019c21521d313

  // plus we should also see a "add social network" button that adds a new form row that looks like the above

  // when the user saves from edit, the entire UserData object is sent back to /profile/:principalID with an HTTP PUT

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
                value={network.network_name}
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
              networkData={network.network_name}
              setSocialNetworkList={setSocialNetworkList}
            />
          );
        }
      })}
      <Grid item xs={isEditable ? 10 : 1}>
        {/* The button will disappear after adding five additional social network fields */}
        {isEditable && socialNetworkList.length <= 5 && (
          <Button
            component="button"
            variant="contained"
            onClick={() => {
              setSocialNetworkList(prevState => [
                ...prevState,
                {
                  network_name: '',
                  profile_url: '',
                  public: true,
                  user_name: '',
                },
              ]);
            }}
          >
            Add a Network
          </Button>
        )}
      </Grid>
    </>
  );
};

export default SocialLinks;
