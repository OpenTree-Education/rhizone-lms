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

import EditIcon from '@mui/icons-material/Edit';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';

import { GitHubUser, SocialProfile, UserData } from '../types/api.d';
import SocialProfileLinks from './SocialLinks';

// default data in case we don't get anything back from the db
let user: UserData;
let id = -1;
let avatar_url = '';
let full_name = '';
let bio = '';
let email_address = '';
let github_accounts: GitHubUser[] = [];
let social_profiles: SocialProfile[] = [];

const Profile = () => {
  const greeting = getGreeting(full_name);
  const { data: api_user_data } = useApiData<UserData[]>({
    path: `/profile/1`,
    sendCredentials: true,
  });
  console.log(user);

  if (api_user_data && api_user_data.length > 0) {
    const [user_data] = api_user_data;
    console.log("api_user_data: ", api_user_data);
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

    console.log(user);
  }

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
            {greeting}
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
              {full_name}
            </Typography>
            <Tooltip title='Edit'>
              <IconButton
                component="button"
                sx={{ ml: 2 }}
              >
                  <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            alignItems={{ md: 'center', sm: 'center' }}
            sx={{ mt: 3 }}
            ml={{ md: -1, sm: -2 }}
          >
            <SocialProfileLinks profileList={social_profiles} />
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
            {bio}
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
