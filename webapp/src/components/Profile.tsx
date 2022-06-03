import React, { useState } from 'react';
import { getGreeting } from '../helpers/greeting';
import useApiData from '../helpers/useApiData';
import { EntityId, Profile as APIProfile } from '../types/api';
import SessionContext from './SessionContext';

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
  TextField,
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';
import SocialLinks from './SocialLinks';

/**
 * @privateRemarks
 * User data is currently hardcoded but it will be pulling data from the database (github_users)
 */

interface DummyUserData {
  full_name: string;
  email: string;
  avatar: string;
  summary?: string;
}

const user: DummyUserData = {
  full_name: 'Matthew Morenez',
  email: 'profile@example.com',
  avatar:
    'https://media.volinspire.com/images/95/e4/99/95e499b759ba57975a61c7bf66a3414dd5a2625e_profile.jpg',
  summary:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint delectus enim earum non repellendus nihil numquam libero odit temporibus et, natus eaque?',
};

const Profile = () => {
  const [isEditable, setIsEditable] = useState(false);
  const [userData, setUserData] = useState(user);
  const greeting = getGreeting(userData.full_name);

  function handleEditButtonClick() {
    setIsEditable(prevState => !prevState);
  }

  /**
   * Editing userData
   *
   * @param e - event the function recieved from input element change event
   *
   * @privateRemarks
   *
   * Update the user data state
   */

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData(prevData => {
      const newUserData = { ...prevData, [e.target.name]: e.target.value };
      return newUserData;
    });
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
            src={userData.avatar}
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
              {isEditable ? (
                <TextField
                  type="text"
                  value={userData.full_name}
                  onChange={handleChange}
                  name="full_name"
                  variant="standard"
                  label="Full name"
                />
              ) : (
                userData.full_name
              )}
              &apos;s Profile
            </Typography>
            <Tooltip title={isEditable ? 'Save' : 'Edit'}>
              <IconButton
                component="button"
                sx={{ ml: 2 }}
                onClick={handleEditButtonClick}
              >
                {!isEditable ? (
                  <EditIcon color="primary" />
                ) : (
                  <CheckIcon color="primary" />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid
            item
            display="flex"
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ mt: 3 }}
            ml={{ sm: isEditable ? -21 : 0, md: -1, xs: 0 }}
          >
            <EmailIcon
              sx={{
                mr: 1,
                mt: isEditable ? 3 : 0,
              }}
              color="primary"
            />
            <Typography component="p">
              {isEditable ? (
                <TextField
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  name="email"
                  variant="standard"
                  label="Email"
                />
              ) : (
                userData.email
              )}
            </Typography>
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            alignItems={{ md: 'center', sm: 'center' }}
            sx={{ mt: 3 }}
            ml={{ md: -1, sm: -2 }}
          >
            <SocialLinks isEditable={isEditable} />
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
            {isEditable ? (
              <TextField
                value={userData.summary}
                onChange={handleChange}
                name="summary"
                variant="standard"
                label="User Summary"
                multiline
                fullWidth
              />
            ) : (
              userData.summary
            )}
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
