import { Rating, styled, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import React from 'react';

const CompetencyRatings = () => {
  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#1976d2',
    },
  });
  /**
   *
   * @privateRemarks
   * For the competency rating scale
   *
   */

  const rating = 3.6;
  return (
    <>
      <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
        Computational Thinking
      </Typography>
      <StyledRating
        value={rating}
        readOnly
        icon={<CircleIcon />}
        emptyIcon={<CircleIcon />}
        precision={0.1}
      />
    </>
  );
};

export default CompetencyRatings;
