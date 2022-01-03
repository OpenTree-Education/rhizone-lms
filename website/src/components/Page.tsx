import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Helmet } from 'react-helmet';
import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Section from '../components/Section';
import { PageData } from '../types/content';
import theme from '../components/theme';

export const Page = ({
  background,
  description,
  sections,
  title,
}: PageData) => (
  <>
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
    <CssBaseline />
    <GlobalStyles styles="@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');" />
    <GlobalStyles styles={{ body: { background } }} />
    <ThemeProvider theme={theme}>
      <Header />
      {sections.map((sectionData, index) => (
        <Section key={index} {...sectionData} />
      ))}
      <Footer />
    </ThemeProvider>
  </>
);

export default Page;
