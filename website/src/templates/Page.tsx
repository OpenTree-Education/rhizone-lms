import CssBaseline from '@mui/material/CssBaseline';
import { Helmet } from 'react-helmet';
import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Footer from '../components/Footer';
import Header from '../components/Header';
import theme from '../components/theme';

interface PageProps {
  pageContext: {
    title: string;
  };
}

const Page = ({ pageContext: { title } }: PageProps) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Page;
