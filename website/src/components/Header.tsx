import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Link as GatsbyLink } from 'gatsby';
import React from 'react';
import Stack from '@mui/material/Stack';
import { useMatch } from '@reach/router';

import opentreeEducationLogo from '../images/opentree-education-logo.svg';
import theme from './theme';

interface TopNavLinkProps {
  children: string;
  to: string;
}

const TopNavLink = ({ children, to }: TopNavLinkProps) => {
  const isCurrentPage = !!useMatch(to);
  const color = isCurrentPage ? 'success' : 'primary';
  return (
    <Box
      sx={{
        [theme.breakpoints.down('md')]: { pt: 1 },
      }}
    >
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
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        py={2}
        sx={{
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        }}
      >
        <Box>
          <GatsbyLink to="/">
            <Stack alignItems="center" direction="row" spacing={1}>
              <img
                alt="illustration of a stylized capital O surrounding a tree"
                height={46}
                src={opentreeEducationLogo}
                width={38}
              />
              <img
                width="100"
                height="36"
                src="https://opentree-education.imgix.net/opentree-education.png?fit=min&amp;q=75&amp;w=100&amp;h=36"
                srcSet="https://opentree-education.imgix.net/opentree-education.png?fit=min&amp;q=75&amp;w=100&amp;h=36, https://opentree-education.imgix.net/opentree-education.png?fit=min&amp;q=50&amp;w=200&amp;h=72 2x"
                alt="OpenTree Education"
              />
            </Stack>
          </GatsbyLink>
        </Box>
        <Box
          ml={4}
          sx={{
            flexGrow: 1,
            [theme.breakpoints.down('md')]: {
              ml: 'auto',
            },
          }}
        >
          <GlobalStyles
            styles={{
              [theme.breakpoints.down('md')]: {
                '#main-navigation': {
                  display: 'none',
                },
                '#reveal-main-navigation:checked + #main-navigation': {
                  display: 'flex',
                },
              },
            }}
          />
          <Button
            component="label"
            htmlFor="reveal-main-navigation"
            size="large"
            variant="contained"
            sx={{
              position: 'absolute',
              right: theme.spacing(3),
              top: theme.spacing(2),
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
              [theme.breakpoints.down('sm')]: {
                right: theme.spacing(2),
              },
            }}
          >
            Menu
          </Button>
          <input
            type="checkbox"
            id="reveal-main-navigation"
            name="reveal-main-navigation"
            style={{ position: 'absolute', top: '-50px' }}
          />
          <nav id="main-navigation">
            <Stack
              alignItems="flex-end"
              direction="row"
              spacing={2}
              sx={{
                [theme.breakpoints.down('md')]: {
                  flexDirection: 'column',
                  mt: 1,
                },
              }}
            >
              <TopNavLink to="/professional-mentorship-program/">
                Program
              </TopNavLink>
              <TopNavLink to="/employers/">Employers</TopNavLink>
              <TopNavLink to="/about/">About</TopNavLink>
              <TopNavLink to="/contact/">Contact</TopNavLink>
              <Box sx={{ flexGrow: 1 }} />
              <Box
                sx={{
                  [theme.breakpoints.down('md')]: { pt: 1 },
                }}
              >
                <Button
                  component={GatsbyLink}
                  size="large"
                  to="/professional-mentorship-program/#apply"
                  variant="outlined"
                >
                  Apply&nbsp;Now
                </Button>
              </Box>
            </Stack>
          </nav>
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default Header;
