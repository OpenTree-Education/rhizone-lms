import { Helmet } from 'react-helmet';
import React from 'react';

import opentreeEducationLogo from '../images/opentree-education-logo.svg';

interface PageProps {
  pageContext: {
    title: string;
  };
}

const Page = ({ pageContext: { title } }: PageProps) => {
  return (
    <main>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <img alt="OpenTree Education logo" src={opentreeEducationLogo} />
      <h1>OpenTree Education</h1>
    </main>
  );
};

export default Page;
