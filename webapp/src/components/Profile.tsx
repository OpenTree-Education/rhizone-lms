import React, { useContext } from 'react';
import { getGreeting } from '../helpers/greeting';

import {
  Container,
  Grid,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';

/**
 * @privateRemarks
 * User data is currently hardcoded but it will be pulling data from the database (github_users)
 */

//
import { useState } from 'react';
import useApiData from '../helpers/useApiData';
import { EntityId, Profile as APIProfile } from '../types/api';
import SessionContext from './SessionContext';

// const user = {
//   name: 'Matthew Morenez',
//   email: 'profile@example.com',
//   avatar:
//     'https://media.volinspire.com/images/95/e4/99/95e499b759ba57975a61c7bf66a3414dd5a2625e_profile.jpg',
//   github: 'https://github.com',
//   website: 'https://example.com',
//   summary:
//     'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint delectus enim earum non repellendus nihil numquam libero odit temporibus et, natus eaque?',
//   linkedIn: 'https://linkedin.com',
// };

const Profile = () => {
  const { principalId } = useContext(SessionContext);
  console.log({ id: principalId });
  const [changedUserDataIds, setChangedUserDataIds] = useState<EntityId[]>([]);
  const { data: userData, error } = useApiData<APIProfile[]>({
    deps: [changedUserDataIds],
    path: `/profile/${principalId}`,
    sendCredentials: true,
  });
  console.log('id', userData && userData[0].github_accounts[0].avatar_url);
  {
    const ref = [
      {
        id: 1,
        full_name: null,
        email_address: null,
        bio: null,
        github_accounts: [
          {
            github_id: 26878542,
            username: 'SiriusLL',
            full_name: null,
            bio: 'Full Stack Junior Web Developer ~ “The Way is not in the sky; the Way is in the heart.” --Buddha',
            avatar_url: 'https://avatars.githubusercontent.com/u/26878542?v=4',
            principal_id: 1,
          },
        ],
        social_profiles: [
          {
            network_name: 'github',
            user_name: 'SiriusLL',
            profile_url: '//github.com/SiriusLL',
            public: 1,
          },
        ],
      },
    ];
  }

  // const getUserProfileData = (key: string) => {
  //   const data = userData && userData[0][key] ? userData[0].full_name : userData && userData[0].github_accounts[0].full_name ?  userData[0].github_accounts[0].full_name : 'no name found!!'
  // }

  const userName: string =
    userData && userData[0]?.full_name
      ? userData[0]?.github_accounts[0].full_name
      : 'no name found!!';

  const greeting = getGreeting(userName);

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
            src={
              (userData && userData[0].github_accounts[0].avatar_url) ||
              undefined
            }
          ></Avatar>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          alignItems={{ md: 'flex-start', sm: 'center' }}
          display="flex"
          flexDirection="column"
        >
          <Typography component="h2" variant="h4">
            {userData && userData[0].full_name
              ? userData[0].full_name
              : userData && userData[0].github_accounts[0].full_name
              ? userData[0].github_accounts[0].full_name
              : 'no name found!!'}{' '}
            &apos;s Profile
          </Typography>
          <Typography
            component="p"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
          >
            <EmailIcon sx={{ mr: 1 }} color="primary" />

            {/* should we add "|| null" ? */}
            {(userData && userData[0].email_address) || 'no email found!!'}
          </Typography>
          <Grid
            container
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            display="flex"
            sx={{ ml: -1, mt: 3 }}
          >
            {/* <Grid item xs={1}>
              <Tooltip title="GitHub">
                <IconButton component="a" sx={{ mr: 1 }} href={user.github}>
                  <GitHubIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="LinkedIn">
                <IconButton component="a" sx={{ mr: 1 }} href={user.linkedIn}>
                  <LinkedInIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="Portfolio">
                <IconButton component="a" sx={{ mr: 1 }} href={user.website}>
                  <LanguageIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          <Typography component="p">
            {userData && userData[0].bio
              ? userData[0].bio
              : userData && userData[0].github_accounts[0].bio
              ? userData[0].github_accounts[0].bio
              : 'no bio found!!'}
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
