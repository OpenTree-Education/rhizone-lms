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

interface PageProps {
  pageContext: PageData;
}

const Page = ({ pageContext: { background, sections, title } }: PageProps) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <CssBaseline />
    <GlobalStyles styles="@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');" />
    <GlobalStyles styles={{ body: { background }, p: { maxWidth: '40em' } }} />
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
