import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import React from 'react';

import { SectionData } from '../types/content';
import theme from './theme';
import Column from './Column';

const verticalAlignmentsMap = {
  bottom: 'flex-end',
  middle: 'center',
  top: 'flex-start',
};

const Section = ({
  background,
  backgroundMobile,
  columns,
  id,
  minHeight,
  verticalAlignment = 'top',
  verticalWhiteSpace = 10,
}: SectionData) => (
  <Box
    component="section"
    id={id}
    sx={
      background && backgroundMobile
        ? {
            [theme.breakpoints.up('md')]: { background },
            [theme.breakpoints.down('md')]: { background: backgroundMobile },
          }
        : {
            background,
          }
    }
  >
    <Container maxWidth="xl" sx={{ py: verticalWhiteSpace }}>
      <Grid
        alignItems={verticalAlignmentsMap[verticalAlignment]}
        columnSpacing={4}
        container
        justifyContent="center"
        sx={{ [theme.breakpoints.up('md')]: { minHeight } }}
      >
        {columns.map(Column)}
      </Grid>
    </Container>
  </Box>
);

export default Section;
