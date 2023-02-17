import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const Footer = () => (
  <Box sx={{ py: 12 }}>
    <Typography align="center">
      <small>
        © OpenTree Education Inc. | <Link to="/terms-of-use">Terms of Use</Link>{' '}
        | <Link to="privacy-policy">Privacy Policy</Link>
      </small>
    </Typography>
  </Box>
);

export default Footer;
