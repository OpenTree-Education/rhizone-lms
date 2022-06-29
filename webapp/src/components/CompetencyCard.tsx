import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DoneIcon from '@mui/icons-material/Done';

import React from 'react';

interface CardProps {
  id: number;
  image_url: string;
  label: string;
}

const CompetencyCard = ({ id, image_url, label }: CardProps) => {
  return (
    <Card
      sx={{
        width: 345,
        height: 250,
        margin: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CardActionArea>
        <CardMedia component="img" height="200" image={image_url} alt={label} />
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {label}
          </Typography>
          <Button
            size="small"
            color="primary"
            component="a"
            sx={{
              mr: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            href={`/competencies/questionnaire/${id}`}
          >
            Start <ChevronRightIcon />
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompetencyCard;