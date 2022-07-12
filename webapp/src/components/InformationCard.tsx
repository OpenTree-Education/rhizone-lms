import React from 'react';

import { Card, CardContent, Rating, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';

const StyledCircleIcon = styled(CircleIcon)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '0.8rem',
  },
}));

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1976d2',
  },
});

const InformationCard = () => {
  return (
    <div>
      <Card sx={{ width: '80%', margin: '3px auto 25px' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ margin: 10 }}>
            <Typography
              variant="h6"
              component="h4"
              style={{ marginBottom: 10 }}
            >
              5-Level Proficiency Rating
            </Typography>
            <div style={{ display: 'flex', marginTop: 2 }}>
              <StyledRating
                value={1}
                readOnly
                icon={<StyledCircleIcon />}
                emptyIcon={<StyledCircleIcon />}
                precision={1}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="body1" component="p">
                Aware — You are aware of the competency but are unable to
                perform tasks.{' '}
              </Typography>
            </div>
            <div style={{ display: 'flex', marginTop: 2 }}>
              <StyledRating
                value={2}
                readOnly
                icon={<StyledCircleIcon />}
                emptyIcon={<StyledCircleIcon />}
                precision={1}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="body1" component="p">
                Novice (limited proficiency) — You understand and can discuss
                terminology, concepts, and issues.{' '}
              </Typography>
            </div>
            <div style={{ display: 'flex', marginTop: 2 }}>
              <StyledRating
                value={3}
                readOnly
                icon={<StyledCircleIcon />}
                emptyIcon={<StyledCircleIcon />}
                precision={1}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="body1" component="p">
                Intermediate proficiency — You have applied this skill to
                situations occasionally without needing guidance.{' '}
              </Typography>
            </div>
            <div style={{ display: 'flex', marginTop: 2 }}>
              <StyledRating
                value={4}
                readOnly
                icon={<StyledCircleIcon />}
                emptyIcon={<StyledCircleIcon />}
                precision={1}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="body1" component="p">
                Advanced proficiency — You can coach others in the application
                by explaining related nuances.{' '}
              </Typography>
            </div>
            <div style={{ display: 'flex', marginTop: 2 }}>
              <StyledRating
                value={5}
                readOnly
                icon={<StyledCircleIcon />}
                emptyIcon={<StyledCircleIcon />}
                precision={1}
                sx={{ marginRight: 2 }}
              />
              <Typography variant="body1" component="p">
                Expert — You have demonstrated consistent excellence across
                multiple projects.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationCard;
