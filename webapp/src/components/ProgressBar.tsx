import React from 'react';
import { LinearProgress, Tooltip, Typography } from '@mui/material';

const ProgressBar = () => {
  /** 

   @privateRemarks
   the dates are placeholders for now. The actual date values will be pulled from the database later on 
   
   months read as: 0 - 11 instead of 1 - 12

   will later add a function to convert the date string into the Date format 
   */

  const start_date = new Date(2022, 4, 1).getTime();
  const end_date = new Date(2022, 7, 30).getTime();

  const today = new Date().getTime();

  let progress_pct: number;

  switch (true) {
    case today >= end_date:
      progress_pct = 100;
      break;
    case today > start_date:
      const progress_period = today - start_date;
      const time_period = end_date - start_date;
      progress_pct = Math.round((100 * progress_period) / time_period);
      break;
    default:
      progress_pct = 0;
  }
  return (
    <>
      <Typography component="h4" variant="h5" sx={{ mt: 5, mb: 2 }}>
        Learning Progress
      </Typography>
      <Tooltip title={`${progress_pct}%`}>
        <LinearProgress
          value={progress_pct}
          variant="determinate"
          sx={{ height: 10, borderRadius: 20 }}
        />
      </Tooltip>
    </>
  );
};

export default ProgressBar;
