import Box from '@mui/material/Box';
import { Link as GatsbyLink } from 'gatsby';
import MuiLink from '@mui/material/Link';
import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import opentreeEducationLogo from '../images/opentree-education-logo.svg';

const Footer = () => (
  <Box px={3} sx={{ backgroundColor: 'info.light' }}>
    <Stack direction="row" justifyContent="flex-start" spacing={4} py={6}>
      <Box>
        <GatsbyLink to="/">
          <img
            alt="illustration of a stylized capital O surrounding a tree"
            height={96}
            src={opentreeEducationLogo}
            width={96}
          />
        </GatsbyLink>
      </Box>
      <Stack>
        <Typography variant="overline">Program</Typography>
        <MuiLink
          component={GatsbyLink}
          to="/professional-mentorship-program/"
          sx={{ color: 'primary.dark' }}
        >
          Professional Mentorship Program
        </MuiLink>
        <MuiLink
          component={GatsbyLink}
          to="/employers/"
          sx={{ color: 'primary.dark' }}
        >
          Employers
        </MuiLink>
      </Stack>
      <Stack>
        <Typography variant="overline">Company</Typography>
        <MuiLink
          component={GatsbyLink}
          to="/about/"
          sx={{ color: 'primary.dark' }}
        >
          About
        </MuiLink>
        <MuiLink
          component={GatsbyLink}
          to="/blog/"
          sx={{ color: 'primary.dark' }}
        >
          Blog
        </MuiLink>
        <MuiLink
          component={GatsbyLink}
          to="/careers/"
          sx={{ color: 'primary.dark' }}
        >
          Careers
        </MuiLink>
        <MuiLink
          component={GatsbyLink}
          to="/contact/"
          sx={{ color: 'primary.dark' }}
        >
          Contact
        </MuiLink>
      </Stack>
    </Stack>
    <Stack
      direction="row"
      justifyContent="space-between"
      py={6}
      spacing={2}
      sx={{ flexWrap: 'wrap' }}
    >
      <Stack direction="row" spacing={2}>
        <Typography variant="caption">© OpenTree Education Inc.</Typography>
        <Typography variant="caption">
          <MuiLink
            component={GatsbyLink}
            to="/privacy-policy/"
            sx={{ color: 'primary.dark' }}
          >
            Privacy Policy
          </MuiLink>
        </Typography>
      </Stack>
      <Typography variant="caption">
        Website made with care by Davey Feimer, Glen Chua, and David VanDusen
      </Typography>
    </Stack>
  </Box>
);

export default Footer;
