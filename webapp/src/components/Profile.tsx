import React, { useEffect } from 'react';
import { getGreeting } from '../helpers/greeting';
import useApiData from '../helpers/useApiData';

import {
  Container,
  Grid,
  Avatar,
  Tooltip,
  Divider,
  IconButton,
  Typography,
  Button,
  Stack
} from '@mui/material';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';

import { SocialNetwork, UserData } from '../types/api.d';
import { parseServerProfileResponse } from '../helpers/profileHelper';
import SocialProfileLinks from './SocialLinks';
import ProfileEditingForm from './ProfileEditingForm';
import SessionContext from './SessionContext';

let user_data: UserData = {
  id: -1,
  full_name: "",
  bio: "",
  avatar_url: "",
  email_address: "",
  github_accounts: [],
  social_profiles: [],
};

const Profile = () => {
  const [ editingMode, setEditingMode ] = React.useState(false);
  const { principalId: sessionPrincipalId } = React.useContext(SessionContext);

  const { data: api_user_data } = useApiData<UserData[]>({
    deps: [sessionPrincipalId],
    path: `/profile/${sessionPrincipalId}`,
    sendCredentials: true,
  });

  const [ userData, setUserData ] = React.useState<UserData>(user_data);

  useEffect(() => {
    user_data = parseServerProfileResponse(api_user_data);
    setUserData(user_data);
  }, [api_user_data]);

  const { data: social_networks_list } = useApiData<SocialNetwork[]>({
    path: `/social_networks`,
    sendCredentials: false
  });

  const updateUser = (event: React.MouseEvent) => {
    event.preventDefault();
    let submittedUserData = userData;

    submittedUserData.full_name = "OpenTree Education";

    // some sort of progress or spinny wheel?

    fetch(`${process.env.REACT_APP_API_ORIGIN}/profile/${sessionPrincipalId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "data": [submittedUserData],
        "summary": {
          "total_count": 1
        }
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        
        // end of progress

        if (error) {
          // handle error other than console.error
          console.error("error from server comms: ", error);
        }
        if (data) {
          // handle success
          console.log("response from server: ", data);

          setUserData(prev => {
            return { ...prev, userData: submittedUserData}});

        }
      })
      .catch(error => {
        // top-level error catch
        console.error("uncaught error", error)
      });

  };

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
        <Grid item>
          <Typography component="h2" variant="h6" color="primary">
            {getGreeting(userData.full_name)}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent={{ md: 'center', sm: 'flex-start' }}
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
            src={userData.avatar_url}
          ></Avatar>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          alignItems={{
            lg: 'flex-start',
            md: 'flex-start',
            sm: 'center',
            xs: 'flex-start',
          }}
          display="flex"
          flexDirection="column"
        >
          <Grid item display="flex">
            <Typography component="h2" variant="h4">
              {userData.full_name}
            </Typography>
            { editingMode ? (
              <Tooltip title="Save">
                <IconButton
                  component="button"
                  sx={{ ml: 2 }}
                  onClick={() => {setEditingMode(!editingMode)}}
                >
                    <CheckIcon color="primary" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Edit">
                <IconButton
                  component="button"
                  sx={{ ml: 2 }}
                  onClick={() => {setEditingMode(!editingMode)}}
                >
                    <EditIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid
            container
            display="flex"
            justifyContent={{ md: 'flex-start', sm: 'center' }}
            alignItems={{ md: 'center', sm: 'center' }}
            sx={{ mt: 3 }}
            ml={{ md: -1, sm: -2 }}
          >
            { (editingMode) ?
                <ProfileEditingForm networksList={social_networks_list} profileList={userData.social_profiles} updateUserFunction={updateUser} /> :
                <SocialProfileLinks profileList={userData.social_profiles} />
            }
            
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          <Typography component="div">
            {userData.bio}
          </Typography>
        </Grid>
        <Stack spacing={2} direction="row" sx={{ mt: 4 }}>
          <Button variant="outlined" component="a" href={'/'}>
            Journal
          </Button>
          <Button variant="outlined" component="a" href={'/competencies'}>
            Competencies
          </Button>
        </Stack>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection={{ md: 'row', xs: 'column' }}
        >
          <Grid item xs={12} md={6}>
            <CompetencyRatings />
          </Grid>
          <Grid item xs={12} md={6}>
            <ProgressBar />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
