import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
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
    <Box>
      <Button
        color={color}
        component={GatsbyLink}
        size="large"
        to={to}
        variant="text"
      >
        {children}
      </Button>
    </Box>
  );
};

const Header = () => (
  <Box sx={{ background: '#ffffff' }}>
    <Container maxWidth="xl">
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        py={2}
        spacing={1}
      >
        <Box pr={3} py={1}>
          <GatsbyLink to="/">
            <Stack alignItems="center" direction="row" spacing={1}>
              <img
                alt="illustration of a stylized capital O surrounding a tree"
                height={56}
                src={opentreeEducationLogo}
                width={46}
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
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ flexGrow: 1, flexWrap: 'wrap' }}
        >
          <Stack
            alignItems="flex-end"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            py={1}
            sx={{ [theme.breakpoints.down('md')]: { flexDirection: 'column' } }}
          >
            <TopNavLink to="/professional-mentorship-program/">
              Program
            </TopNavLink>
            <TopNavLink to="/employers/">Employers</TopNavLink>
            <TopNavLink to="/about/">About</TopNavLink>
            <TopNavLink to="/contact/">Contact</TopNavLink>
          </Stack>
          <Box py={1}>
            <Button
              component={GatsbyLink}
              disableElevation
              size="large"
              to="/professional-mentorship-program/#apply"
              variant="outlined"
            >
              Apply&nbsp;Now
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export default Header;
