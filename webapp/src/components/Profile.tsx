import React, { useState } from 'react';
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
  TextField,
} from '@mui/material';

import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';
import UpdateSocialLinks from './UpdateSocialLinks';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SocialLinks from './SocialLinks';

/**
 * @privateRemarks
 * User data is currently hardcoded but it will be pulling data from the database (github_users)
 */

interface DummyUserData {
  name: string;
  email: string;
  avatar: string;
  summary?: string;
}

const user: DummyUserData = {
  name: 'Matthew Morenez',
  email: 'profile@example.com',
  avatar:
    'https://media.volinspire.com/images/95/e4/99/95e499b759ba57975a61c7bf66a3414dd5a2625e_profile.jpg',
  summary:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint delectus enim earum non repellendus nihil numquam libero odit temporibus et, natus eaque?',
};

const Profile = () => {
  const greeting = getGreeting(user.name);
  const [isEditable, setIsEditable] = useState(false);

  function handleEditButtonClick() {
    setIsEditable(prevState => !prevState);
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
            src={user.avatar}
          ></Avatar>
          {isEditable && (
            <Tooltip title="Upload Image">
              <IconButton component="label">
                <EditIcon color="primary" />
                <input type="file" hidden />
              </IconButton>
            </Tooltip>
          )}
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
            {isEditable ? (
              <TextField
                type="text"
                value={user.name}
                name="full_name"
                variant="standard"
                label="Full name"
              />
            ) : (
              user.name
            )}
            &apos;s Profile
          </Typography>
          <Typography
            component="p"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
          >
            <EmailIcon sx={{ mr: 1 }} color="primary" />
            {isEditable ? (
              <TextField
                type="email"
                value={user.email}
                name="email"
                variant="standard"
                label="Email"
              />
            ) : (
              user.email
            )}
          </Typography>
          <Grid
            container
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            display="flex"
            sx={{ ml: -1, mt: 3 }}
            flexDirection={isEditable ? 'column' : 'row'}
          >
            <SocialLinks isEditable={isEditable} />
          </Grid>
        </Grid>
        <Grid item>
          <Tooltip title="Edit">
            <IconButton component="button">
              {!isEditable ? (
                <EditIcon color="primary" onClick={handleEditButtonClick} />
              ) : (
                <CheckIcon color="primary" onClick={handleEditButtonClick} />
              )}
            </IconButton>
          </Tooltip>
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
                value={user.summary}
                name="email"
                variant="standard"
                label="User Summary"
                multiline
                fullWidth
              />
            ) : (
              user.summary
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
