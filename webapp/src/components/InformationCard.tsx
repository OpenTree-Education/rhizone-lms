import React from 'react';

import { Card, CardContent, Rating } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { styled } from '@mui/material/styles';

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
          <div style={{ fontSize: 16, margin: 10 }}>
            <h4 style={{ marginBottom: 10 }}>5-Level Proficiency Rating</h4>
            <div style={{ display: 'flex' }}>
              <StyledRating
                value={1}
                readOnly
                icon={<CircleIcon />}
                emptyIcon={<CircleIcon />}
                precision={0.1}
                sx={{ marginRight: 2 }}
              />
              <p style={{ marginTop: 2, fontSize: 16 }}>
                Awareness — You are aware of the competency but are unable to
                perform tasks.{' '}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <StyledRating
                value={2}
                readOnly
                icon={<CircleIcon />}
                emptyIcon={<CircleIcon />}
                precision={0.1}
                sx={{ marginRight: 2 }}
              />
              <p style={{ marginTop: 2, fontSize: 16 }}>
                Novice (limited proficiency) — You understand and can discuss
                terminology, concepts, and issues.{' '}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <StyledRating
                value={3}
                readOnly
                icon={<CircleIcon />}
                emptyIcon={<CircleIcon />}
                precision={0.1}
                sx={{ marginRight: 2 }}
              />
              <p style={{ marginTop: 2, fontSize: 16 }}>
                Intermediate proficiency — You have applied this skill to
                situations occasionally without needing guidance.{' '}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <StyledRating
                value={4}
                readOnly
                icon={<CircleIcon />}
                emptyIcon={<CircleIcon />}
                precision={0.1}
                sx={{ marginRight: 2 }}
              />
              <p style={{ marginTop: 2, fontSize: 16 }}>
                Advanced proficiency — You can coach others in the application
                by explaining related nuances.{' '}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <StyledRating
                value={5}
                readOnly
                icon={<CircleIcon />}
                emptyIcon={<CircleIcon />}
                precision={0.1}
                sx={{ marginRight: 2 }}
              />
              <p style={{ marginTop: 2, fontSize: 16 }}>
                Expert — You have demonstrated consistent excellence across
                multiple projects.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationCard;
