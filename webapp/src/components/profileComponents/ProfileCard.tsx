import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Button, Grid, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { CallMissedSharp } from '@mui/icons-material';


const useStyles = makeStyles({
  root: {
    maxWidth: '40%',
  },
  media: {
    height: 600,
  },
  social: {
    justifyContent: 'space-around',
  }
});

const userData = {
  id: 1,
  name: "Ryan Cohen",
  email: "rc@gmail.com",
  github: 'https://github.com/imryan',
  summery: 'this is a summery',
  bio: 'The chair man',
  socialLinks: {twitter: 'https://twitter.com/ryancohen', linkIn: 'https://www.linkedin.com/in/ryandcohen/'},
  avatar: '/images/avatar.jpg',
}

export default function MediaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={userData.avatar}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {userData.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {userData.bio}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.social}>

        <IconButton sx={{ mr: 1 }} >
          <TwitterIcon sx={{fontSize: '40px', color: 'lightBlue'}} />
        </IconButton>
        
        <IconButton sx={{ mr: 1 }} >
         <LinkedInIcon sx={{fontSize: '40px', color: 'lightBlue'}}/>
        </IconButton>

      </CardActions>
    </Card>
  );
}