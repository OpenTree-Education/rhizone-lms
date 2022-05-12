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
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CircleIcon from '@mui/icons-material/Circle';
import LanguageIcon from '@mui/icons-material/Language';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import Typography from '@mui/material/Typography';
import GroupsIcon from '@mui/icons-material/Groups';
import BookIcon from '@mui/icons-material/Book';

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
        sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
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
          <Avatar sx={{ width: 100, height: 100 }} src={user.avatar}></Avatar>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          alignItems={{ md: 'flex-start', sm: 'center' }}
          display="flex"
          flexDirection="column"
        >
          <h2>{user.name}&apos;s Profile</h2>
          <p>{user.email}</p>
          <Grid
            container
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            display="flex"
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
      <Divider variant="fullWidth" />
      <Grid container justifyContent="center">
        <Grid item md={8}>
          <h3>Summary</h3>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia,
            sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint
            delectus enim earum non repellendus nihil numquam libero odit
            temporibus et, natus eaque?
          </p>
        </Grid>
        <Grid item md={8}>
          <Button component="a" sx={{ mr: 1 }} href={'/competencies'}>
            <AutoGraphIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block">
              Competencies
            </Typography>
          </Button>
          <Button component="a" sx={{ mr: 1 }} href="">
            <GroupsIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block">
              Meeting
            </Typography>
          </Button>
          <Button component="a" sx={{ mr: 1 }} href="">
            <BookIcon sx={{ mr: 2 }} />
            <Typography variant="button" display="block">
              Journal
            </Typography>
          </Button>
          <h4>Computational Thinking</h4>
          <Tooltip title="Rating 3">
            <Rating
              value={3}
              readOnly
              icon={<CircleIcon />}
              emptyIcon={<CircleIcon />}
              color="primary"
            />
          </Tooltip>
          <h4>Learning</h4>
          <Tooltip title="Progress 80%">
            <LinearProgress
              value={80}
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
