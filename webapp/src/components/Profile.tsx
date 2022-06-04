import React from 'react';
import { getGreeting } from '../helpers/greeting';
import useApiData from '../helpers/useApiData';

import {
  Container,
  Grid,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';

import { GitHubUser, SocialNetwork, SocialProfile, UserData } from '../types/api.d';
import SocialProfileLinks from './SocialLinks';
import ProfileEditingForm from './ProfileEditingForm';

// default data in case we don't get anything back from the db
let id = -1;
let avatar_url = '';
let full_name = '';
let bio = '';
let email_address = '';
let github_accounts: GitHubUser[] = [];
let social_profiles: SocialProfile[] = [];
let user: UserData = {
  id: id,
  full_name: full_name,
  bio: bio,
  email_address: email_address,
  github_accounts: github_accounts,
  social_profiles: social_profiles,
};

const Profile = () => {
  const [ editingMode, setEditingMode ] = React.useState(false);
  const [ userData, setUserData ] = React.useState<UserData>(user);
  const { data: api_user_data } = useApiData<UserData[]>({
    path: `/profile/1`,
    sendCredentials: true,
  });

  const { data: social_networks_list } = useApiData<SocialNetwork[]>({
    path: `/social_networks`,
    sendCredentials: false
  });

  const updateUser = () => {
    let new_user_obj = userData;
    new_user_obj.full_name = "OpenTree Education";
    setUserData(prev => {
      return { ...prev, userData: new_user_obj}});
  };

  if (userData.id === -1) {
  if (api_user_data && api_user_data.length > 0) {
    const [user_data] = api_user_data;
    // console.log("api_user_data: ", api_user_data);
    user = user_data;

    if (user.id && user.id !== 'null') {
      if (typeof user.id === 'string') {
        id = parseInt(user.id);
      } else if (typeof user.id === 'number') {
        const { id: userId } = user;
        id = userId;
      }
    }

    if (user.full_name && user.full_name !== '') {
      const { full_name: fullName } = user;
      full_name = fullName;
    }

    if (user.bio && user.bio !== '') {
      const { bio: userBio } = user;
      bio = userBio;
    }

    if (user.email_address && user.email_address !== '') {
      const { email_address: userEmail } = user;
      email_address = userEmail;
    }

    if (user.github_accounts && user.github_accounts.length > 0) {
      const [github_account] = user.github_accounts;
      github_accounts.push(github_account);

      if (github_account.avatar_url) {
        const { avatar_url: avatar } = github_account;
        avatar_url = avatar;
      }
      if (github_account.full_name && github_account.full_name !== '') {
        if (full_name === '') {
          const { full_name: fullName } = github_account;
          full_name = fullName;
        }
      }
    }

    if (user.social_profiles && user.social_profiles.length > 0) {
      const { social_profiles: social_profile_list } = user;
      social_profiles = social_profile_list;

      social_profile_list.forEach((social_profile) => {
        if (social_profile.network_name === 'email') {
          if (email_address === '') {
            email_address = social_profile.user_name;
          }
        }
      });
    }

    user = {
      id: id,
      full_name: full_name,
      bio: bio,
      email_address: email_address,
      github_accounts: github_accounts,
      social_profiles: social_profiles,
    };

    setUserData(prev => user);

    // console.log("I have updated the user object. It now looks like this:", user);
  }}

  return (
    <Container fixed>
      <Grid
        container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          mb: 4,
        }}
        spacing={2}
      >
        <Grid item>
          <Typography component="h2" variant="h6" color="primary">
            {getGreeting(userData.full_name)}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={{ md: 'center', sm: 'flex-start' }}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: '3px solid #fff',
              outline: '2px solid #1976d2',
            }}
            src={avatar_url}
          ></Avatar>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          alignItems={{
            lg: 'flex-start',
            md: 'flex-start',
            sm: 'center',
            xs: 'flex-start',
          }}
          display="flex"
          flexDirection="column"
        >
          <Grid item display="flex">
            <Typography component="h2" variant="h4">
              {userData.full_name}
            </Typography>
            { editingMode ? (
              <Tooltip title="Save">
                <IconButton
                  component="button"
                  sx={{ ml: 2 }}
                  onClick={() => {setEditingMode(!editingMode)}}
                >
                    <CheckIcon color="primary" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Edit">
                <IconButton
                  component="button"
                  sx={{ ml: 2 }}
                  onClick={() => {setEditingMode(!editingMode)}}
                >
                    <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            alignItems={{ md: 'center', sm: 'center' }}
            sx={{ mt: 3 }}
            ml={{ md: -1, sm: -2 }}
          >
            { (editingMode) ?
                <ProfileEditingForm networksList={social_networks_list} profileList={userData.social_profiles} updateUserFunction={updateUser} /> :
                <SocialProfileLinks profileList={userData.social_profiles} />
            }
            
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          <Typography component="div">
            {userData.bio}
          </Typography>
        </Grid>
        <Stack spacing={2} direction="row" sx={{ mt: 4 }}>
          <Button variant="outlined" component="a" href={'/'}>
            Journal
          </Button>
          <Button variant="outlined" component="a" href={'/competencies'}>
            Competencies
          </Button>
        </Stack>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection={{ md: 'row', xs: 'column' }}
        >
          <Grid item xs={12} md={6}>
            <CompetencyRatings />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgressBar />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
