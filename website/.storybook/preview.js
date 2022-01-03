import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { LocationProvider } from '@reach/router';
import React from 'react';
import { ThemeProvider } from '@mui/material';

import theme from '../src/components/theme';

export const parameters = {
  controls: { expanded: true },
  options: {
    storySort: {
      order: [
        'Guides',
        ['Introduction', 'Pages', 'Posts', 'Theme', 'Redirects', 'Adding features'],
        'Components',
        ['Page Template', 'Page', 'Section', 'Column', 'Post'],
      ],
    },
  },
};

export const decorators = [
  Story => (
    <LocationProvider>
      <CssBaseline />
      <GlobalStyles styles="@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');" />
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </LocationProvider>
  ),
];
