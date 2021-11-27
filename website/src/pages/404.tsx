import React from 'react';
import { Helmet } from 'react-helmet';

const NotFoundPage = () => {
  return (
    <main>
      <Helmet>
        <title>Not found</title>
      </Helmet>
      <h1>Page not found</h1>
    </main>
  );
};

export default NotFoundPage;
