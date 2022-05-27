import React from 'react';

import {
  Container,
  Grid,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack,
} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';

const user = {
  name: 'Matthew Morenez',
  email: 'profile@example.com',
  avatar:
    'https://media.volinspire.com/images/95/e4/99/95e499b759ba57975a61c7bf66a3414dd5a2625e_profile.jpg',
  github: 'https://github.com',
  website: 'https://example.com',
  summary:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, sit impedit? Cupiditate veniam eaque suscipit eligendi. Sint delectus enim earum non repellendus nihil numquam libero odit temporibus et, natus eaque?',
  linkedIn: 'https://linkedin.com',
};

type GreetingType = {
  greeting: string;
  delimiter: string;
  beginning_punct: string;
  ending_punct: string;
  ltr: 'ltr' | 'rtl';
};

let morning_greetings = new Map<string, GreetingType>();
morning_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good morning',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
morning_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bon matin',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});

let afternoon_greetings = new Map<string, GreetingType>();
afternoon_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good afternoon',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
afternoon_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bonne après-midi',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});

let evening_greetings = new Map<string, GreetingType>();
evening_greetings.set('en', {
  beginning_punct: '',
  greeting: 'Good evening',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});
evening_greetings.set('fr', {
  beginning_punct: '',
  greeting: 'Bonsoir',
  delimiter: ', ',
  ending_punct: '!',
  ltr: 'ltr',
});

/**
 * Returns the greeting string based on the different time of the day in a preferred language.
 *
 * @param timeOfDay - "morning", "afternoon" or "evening" depending on the time of the day
 * @returns The user_greeting_string which includes the structure of the greeting string (ex. "Good morning, {username}!")
 *
 */
const languageGreeting = (timeOfDay: string, preferredLanguage: string) => {
  let user_greeting: GreetingType | any = {
    // beginning_punct: '',
    // greeting: '',
    // delimiter: '',
    // ending_punct: '',
    // ltr: 'ltr',
  };

  if (timeOfDay === 'morning') {
    user_greeting =
      morning_greetings.get(preferredLanguage) || morning_greetings.get('en')!;
  } else if (timeOfDay === 'afternoon') {
    user_greeting =
      afternoon_greetings.get(preferredLanguage) ||
      afternoon_greetings.get('en')!;
  } else if (timeOfDay === 'evening') {
    user_greeting =
      evening_greetings.get(preferredLanguage) || evening_greetings.get('en')!;
  }

  const user_greeting_string =
    user_greeting.beginning_punct +
    user_greeting.greeting +
    user_greeting.delimiter +
    user.name +
    user_greeting.ending_punct;

  return user_greeting_string;
};

const Profile = () => {
  /**
   * Gets hour based on Date() and returns the greeting string based on the different time of the day.
   *
   * @returns The string which includes the icon and the greeting string depending on the time of the day (ex. "🌅 Good morning, {username}!")
   *
   */
  const getGreeting = () => {
    const myDate = new Date();
    const hrs = myDate.getHours();

    let greet = '';
    // Getting first two characters of the browser language.
    const preferredLanguage = window.navigator.language.slice(0, 2);

    if (hrs >= 2 && hrs < 12)
      greet = `🌅 ${languageGreeting('morning', preferredLanguage)}`;
    else if (hrs >= 12 && hrs <= 17)
      greet = `🌞 ${languageGreeting('afternoon', preferredLanguage)}`;
    else if (hrs >= 17 && hrs === 1)
      greet = `🌇 ${languageGreeting('evening', preferredLanguage)}`;

    return greet;
  };
  const greeting = getGreeting();
      
  return (
    <Container fixed>
      <Grid
        container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          mb: 4,
        }}
        spacing={2}
      >
        <Typography component="h2" variant="h6" color="primary">
          {greeting}
        </Typography>
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              border: '3px solid #fff',
              outline: '2px solid #1976d2',
            }}
            src={user.avatar}
          ></Avatar>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          alignItems={{ md: 'flex-start', sm: 'center' }}
          display="flex"
          flexDirection="column"
        >
          <Typography component="h2" variant="h4">
            {user.name}&apos;s Profile
          </Typography>
          <Typography
            component="p"
            sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
          >
            <EmailIcon sx={{ mr: 1 }} color="primary" />
            {user.email}
          </Typography>
          <Grid
            container
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            display="flex"
            sx={{ ml: -1, mt: 3 }}
          >
            <Grid item xs={1}>
              <Tooltip title="GitHub">
                <IconButton component="a" sx={{ mr: 1 }} href={user.github}>
                  <GitHubIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="LinkedIn">
                <IconButton component="a" sx={{ mr: 1 }} href={user.linkedIn}>
                  <LinkedInIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={1}>
              <Tooltip title="Portfolio">
                <IconButton component="a" sx={{ mr: 1 }} href={user.website}>
                  <LanguageIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          <Typography component="p">{user.summary}</Typography>
        </Grid>
        <Stack spacing={2} direction="row" sx={{ mt: 4 }}>
          <Button variant="outlined" component="a" href={'/'}>
            Journal
          </Button>
          <Button variant="outlined" component="a" href={'/competencies'}>
            Competencies
          </Button>
        </Stack>
      </Grid>
    </Container>
  );
};

export default Profile;
