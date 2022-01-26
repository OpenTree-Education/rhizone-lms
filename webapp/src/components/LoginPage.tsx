import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';

const LoginPage = () => (
  <Container fixed sx={{ pt: 12 }}>
    <Stack alignItems="center">
      <h1>Rhizone</h1>
      <Typography variant="subtitle1">Learning Management System</Typography>
      <Box my={12}>
        <Button
          component="a"
          href={`${process.env.REACT_APP_API_ORIGIN}/auth/github/login`}
          variant="contained"
        >
          Sign In with GitHub
        </Button>
      </Box>
    </Stack>
  </Container>
);

export default LoginPage;
