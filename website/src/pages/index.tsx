import React from 'react';
import { Helmet } from 'react-helmet';

import opentreeEducationLogo from '../images/opentree-education-logo.svg';

const IndexPage = () => {
  return (
    <main>
      <Helmet>
        <title>OpenTree Education</title>
      </Helmet>
      <img alt="OpenTree Education logo" src={opentreeEducationLogo} />
      <h1>OpenTree Education</h1>
    </main>
  );
};

export default IndexPage;
