import React from 'react';

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
  Rating,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import CircleIcon from '@mui/icons-material/Circle';

const user = {
  name: 'Matthew Morenez',
  email: 'profile@example.com',
  avatar:
    'https://media.volinspire.com/images/95/e4/99/95e499b759ba57975a61c7bf66a3414dd5a2625e_profile.jpg',
  github: 'https://github.com',
  website: 'https://example.com',
  summary:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint delectus enim earum non repellendus nihil numquam libero odit temporibus et, natus eaque?',
  linkedIn: 'https://linkedin.com',
};

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1976d2',
  },
});

/** 

   @privateRemarks
   the dates are placeholders for now. The actual date values will be pulled from the database later on 
   
   months read as: 0 - 11 instead of 1 - 12

   will later add a function to convert the date string into the Date format 
   */

const start_date = new Date(2022, 4, 1).getTime();
const end_date = new Date(2022, 5, 30).getTime();

const today = new Date().getTime();

let progress_pct: number;

switch (true) {
  case today >= end_date:
    progress_pct = 100;
    break;
  case today > start_date:
    const progress_period = today - start_date;
    const time_period = end_date - start_date;
    progress_pct = Math.round((100 * progress_period) / time_period);
    break;
  default:
    progress_pct = 0;
}

/**
 *
 * @privateRemarks
 * For the competency rating scale
 *
 */

const rating = 3.6;

const Profile = () => {
  return (
    <Container fixed>
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
            {user.name}&apos;s Profile
          </Typography>
          <Typography
            component="p"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
          >
            <EmailIcon sx={{ mr: 1 }} color="primary" />
            {user.email}
          </Typography>
          <Grid
            container
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            display="flex"
            sx={{ ml: -1, mt: 3 }}
          >
            <Grid item xs={1}>
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          <Typography component="p">{user.summary}</Typography>
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
            <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
              Computational Thinking
            </Typography>
            <StyledRating
              value={rating}
              readOnly
              icon={<CircleIcon />}
              emptyIcon={<CircleIcon />}
              precision={0.1}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
              Learning Progress
            </Typography>
            <Tooltip title={`${progress_pct}%`}>
              <LinearProgress
                value={progress_pct}
                variant="determinate"
                sx={{ height: 10, borderRadius: 20 }}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
