import React from 'react';
import {
  Container,
  Grid,
  Avatar,
  Rating,
  Tooltip,
  LinearProgress,
  Divider,
  IconButton,
  Button,
  Typography,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CircleIcon from '@mui/icons-material/Circle';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import GroupsIcon from '@mui/icons-material/Groups';
import BookIcon from '@mui/icons-material/Book';
import EmailIcon from '@mui/icons-material/Email';

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
              <Tooltip title="Porfolio">
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
        <Grid item md={12}>
          <Button
            component="a"
            sx={{ mr: 1, height: '40px' }}
            href={'/competencies'}
          >
            <AutoGraphIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block" sx={{ my: 2 }}>
              Competencies
            </Typography>
          </Button>
          <Button component="a" sx={{ mr: 1, height: '40px' }} href="">
            <GroupsIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block" sx={{ my: 2 }}>
              Meeting
            </Typography>
          </Button>
          <Button component="a" sx={{ mr: 1, height: '40px' }} href="">
            <BookIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block" sx={{ my: 2 }}>
              Journal
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
            Computational Thinking
          </Typography>
          <Tooltip title="Rating 3">
            <Rating
              value={3.7}
              readOnly
              icon={<CircleIcon />}
              emptyIcon={<CircleIcon />}
              precision={0.1}
            />
          </Tooltip>
          <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
            Learning Progress
          </Typography>
          <Tooltip title="83%">
            <LinearProgress
              value={83}
              variant="determinate"
              sx={{ height: 20, borderRadius: 20 }}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
