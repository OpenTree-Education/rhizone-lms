import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
import Stack from '@mui/material/Stack';
import { useMatch } from '@reach/router';

import opentreeEducationLogo from '../images/opentree-education-logo.svg';
import opentreeEducationWordMark from '../images/opentree-education.svg';
import theme from './theme';

interface TopNavLinkProps {
  children: string;
  to: string;
}

const TopNavLink = ({ children, to }: TopNavLinkProps) => {
  const isCurrentPage = !!useMatch(to);
  const color = isCurrentPage ? 'success' : 'primary';
  return (
    <Button
      color={color}
      component={GatsbyLink}
      size="large"
      to={to}
      variant="text"
    >
      {children}
    </Button>
  );
};

const Header = () => (
  <Stack
    alignItems="center"
    direction="row"
    justifyContent="space-between"
    px={3}
    py={2}
    spacing={1}
    sx={{ flexWrap: 'wrap' }}
  >
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      sx={{ flexWrap: 'wrap' }}
    >
      <Box pr={6} py={1}>
        <GatsbyLink to="/">
          <Stack alignItems="center" direction="row">
            <img
              alt="illustration of a stylized capital O surrounding a tree"
              height={64}
              src={opentreeEducationLogo}
              width={64}
            />
            <img
              alt="OpenTree Education"
              height={40}
              src={opentreeEducationWordMark}
              width={116}
            />
          </Stack>
        </GatsbyLink>
      </Box>
      <Stack
        alignItems="flex-end"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        py={1}
        sx={{ [theme.breakpoints.down('sm')]: { flexDirection: 'column' } }}
      >
        <TopNavLink to="/professional-mentorship-program/">Program</TopNavLink>
        <TopNavLink to="/employers/">Employers</TopNavLink>
        <TopNavLink to="/about/">About</TopNavLink>
        <TopNavLink to="/contact/">Contact</TopNavLink>
      </Stack>
    </Stack>
    <Box py={1}>
      <Button
        component={GatsbyLink}
        disableElevation
        size="large"
        to="/professional-mentorship-program/#apply"
        variant="outlined"
      >
        Apply Now
      </Button>
    </Box>
  </Stack>
);

export default Header;
