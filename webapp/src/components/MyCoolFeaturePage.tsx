import React, {useState} from 'react';
import MyCoolComponent from './MyCoolComponent';
import { Container } from '@mui/material';

const MyCoolFeaturePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const previousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  return (
    <Container>
      <h1>My cool feature</h1>
      <MyCoolComponent pageId={currentPage} />
      <button onClick={previousPage}>Previous Page</button>
      <button onClick={nextPage}>Next Page</button>
    </Container>
  );
};

export default MyCoolFeaturePage;
