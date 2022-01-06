import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';

import Footer from './Footer';

const WelcomePage = () => (
  <Container fixed sx={{ pt: 12 }}>
    <Stack alignItems="center">
      <h1>Rhizone</h1>
      <Typography variant="subtitle1">
        The OpenTree Education Learning Management System
      </Typography>
      <Box my={12}>
        <Button
          component="a"
          href={`${process.env.REACT_APP_API_ORIGIN}/auth/github/login`}
          variant="contained"
        >
          Sign In with GitHub
        </Button>
      </Box>
      <Footer />
    </Stack>
  </Container>
);

export default WelcomePage;
