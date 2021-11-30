import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Helmet } from 'react-helmet';
import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Section from '../components/Section';
import { SectionData } from '../types/data';
import theme from '../components/theme';

interface PageProps {
  pageContext: {
    title: string;
    sections: SectionData[];
  };
}

const Page = ({ pageContext: { title, sections } }: PageProps) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <CssBaseline />
    <GlobalStyles styles="@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');" />
    <GlobalStyles styles={{ p: { maxWidth: '36em' } }} />
    <ThemeProvider theme={theme}>
      <Header />
      {sections.map(sectionData => (
        <Section key={sectionData.id} {...sectionData} />
      ))}
      <Footer />
    </ThemeProvider>
  </>
);

export default Page;
