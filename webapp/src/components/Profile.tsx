

import { Button, Grid, Stack, Typography, Paper, ButtonBase, Tooltip } from '@mui/material';
import React from 'react';
// import { ProfileType } from '../types/api';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Avatar from '@mui/material/Avatar';
import TimelineIcon from '@mui/icons-material/Timeline';

// interface ProfileProps {
//   profileObj: ProfileType;
// }
const profileObj = {
  id: 4, 
  name: 'Student Name', 
  email: 'student4@gmail.com', 
  avatar: 'https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png', 
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
  github: 'github-link.com', 
  socialMedia: [], 
  website: 'website.com', 
  journalLink: '', 
  competencies: '', 
  meetingNotes: '', 
  timeProgression: ''
}
// { profileObj }: ProfileProps
const Profile = () => {
  /* 
    Name - string
    Email - string 
    Summary / Bio - string
    Avatar / Profile Picture - string
    Github -> link 
    Social Media Links [] -> array of links (facebook, twitter, instagram, youtube)
    Link to Website -> link
    Journal -> link (reroute)
    Competencies -> link (reroute)
    1:1 Meeting Notes -> link (reroute)
    Time progression of improvement ?
*/


  return (
        <Paper
        sx={{
          p: 2,
          margin: 'auto',
          maxWidth: 'auto',
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
        >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
            <Avatar alt="user" src={profileObj.avatar} sx={{ width: 96, height: 96 }}/>
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h5" component="div">
                  {profileObj.name}
                </Typography>
                <Typography variant="body1" color="black" sx={{marginBottom: 1.5}}>
                {profileObj.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {profileObj.bio}
                </Typography>
              </Grid>
              <Grid item>
              <Stack direction="row" spacing={2} sx={{ marginBottom: 2.5 }}>
                <Button variant="outlined">Journal</Button>
                <Button variant="outlined">Competencies</Button>
                <Button variant="outlined">Meeting Notes</Button>
              </Stack>
               </Grid>
              <Grid item>
                <Button>
                  <GitHubIcon />
                </Button>
                <Button>
                  <TwitterIcon />
                </Button>
                <Button>
                  <FacebookIcon />
                </Button>
                <Button href="#text-buttons">Portfolio</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Tooltip title="Improvement progress">
              <Button>
                <TimelineIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        </Paper>
  );
};

export default Profile;

