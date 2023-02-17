import React, {useState} from 'react';
import MyCoolComponent from './MyCoolComponent';
import { Container, Grid } from '@mui/material';

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
      <Grid container justifyContent="center">
      <h1>Assessment Questions</h1>
      </Grid>
      <Grid container justifyContent="center">
      <MyCoolComponent pageId={currentPage} />
      </Grid>
      <Grid container justifyContent="center">
      <button onClick={previousPage}>Previous Page</button>
      <button onClick={nextPage}>Next Page</button>
      </Grid>
    </Container>


  );
};

export default MyCoolFeaturePage;
