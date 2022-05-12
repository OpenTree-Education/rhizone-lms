import React from 'react';
import ProfileCard from './profileComponents/ProfileCard';
import ProfileData from './profileComponents/ProfileData';
import { Grid } from '@mui/material';

const Profile = () => {
  const userData = {
    id: 1,
    name: 'Elon Musk',
    email: 'rc@gmail.com',
    github: 'https://github.com/imryan',
    summery: 'this is a summery',
    bio: 'this is a bio',
    socialLinks: {
      twitter: 'https://twitter.com/ryancohen',
      linkIn: 'https://www.linkedin.com/in/ryandcohen/',
    },
    avatar: '/images/avatar.jpg',
  };

  return (
    <>
      <h2>Good day --name goes here--</h2>
      <div>Profile</div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ProfileCard {...userData} />
        </Grid>
        <Grid item xs={4}>
          <ProfileData />
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
