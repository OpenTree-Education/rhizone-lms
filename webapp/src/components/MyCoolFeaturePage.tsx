import React, { useEffect, useState } from 'react';
import MyCoolComponent from './MyCoolComponent';
import { Container } from '@mui/material';
import useApiData from '../helpers/useApiData';
import { CurrentUserPageInfo } from '../types/api';

const updateCurrentPage = (currentPageNumber: number) => {
  const body = {
    currentPage: currentPageNumber,
  };
  return fetch(`${process.env.REACT_APP_API_ORIGIN}/my-cool-feature`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(res => res.json());
};

const MyCoolFeaturePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: currentUserPageData, error } = useApiData<CurrentUserPageInfo>({
    deps: [],
    path: `/my-cool-feature`,
    sendCredentials: true,
  });
  useEffect(() => {
    if (currentUserPageData) {
      setCurrentPage(currentUserPageData.page_number);
    }
  }, [currentUserPageData]);
  if (error) {
    return (
      <Container>
        <h1>Error Encountered</h1>
        <p>Can&rsquo;t load current page information from the database.</p>
      </Container>
    );
  }
  if (!currentUserPageData) {
    return null;
  }
  const nextPage = () => {
    updateCurrentPage(currentPage + 1);
    setCurrentPage(currentPage + 1);
  };
  const previousPage = () => {
    updateCurrentPage(currentPage - 1);
    setCurrentPage(currentPage - 1);
  };
  return (
    <Container>
      <h1>My cool feature</h1>
      <MyCoolComponent pageId={currentPage} />
      <button onClick={previousPage} disabled={currentPage === 1}>
        Previous Page
      </button>
      <button onClick={nextPage} disabled={currentPage === 3}>
        Next Page
      </button>
    </Container>
  );
};

export default MyCoolFeaturePage;
