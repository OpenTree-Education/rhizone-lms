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
  Stack,
  TextField,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import ProgressBar from './ProgressBar';
import CompetencyRatings from './CompetencyRatings';

import { SocialNetwork, UserData } from '../types/api';
import { parseServerProfileResponse } from '../helpers/profileHelper';
import UserProfileSocialLinks from './UserProfileSocialLinks';
import UserProfileEditingForm from './UserProfileEditingForm';
import SessionContext from './SessionContext';

/**
 * The default information for a user to be displayed on the page until the API
 * call returns with the correct information.
 */
let user_data: UserData = {
  id: -1,
  full_name: '',
  bio: '',
  avatar_url: '',
  email_address: '',
  github_accounts: [],
  social_profiles: [],
};

/**
 * An enum holding the save status for edits to the page.
 */
enum SaveStatus {
  NO_STATUS,
  SAVING,
  SAVED,
  SAVE_FAILURE,
}

/**
 * SAVE_STATUS_DELAY is the number of milliseconds to wait after showing the
 * success/failure message of edits to the user.
 */
const SAVE_STATUS_DELAY = 3500;

/**
 * In its current state, a Profile component renders the user's own personal
 * profile page. (It cannot currently be used to render a different user's
 * profile page.) When editing mode is triggered, the editable data on the page
 * switches from a static display to a form element display, allowing the user
 * to edit the data saved in the database to be displayed on the page.
 *
 * @returns Profile component for the user
 */
const UserProfile = () => {
  // Store the state of editing: true if we're editing, false if we're not.
  const [editingMode, setEditingMode] = React.useState(false);

  // Store the state of the saving of edits.
  const [saveStatus, setSaveStatus] = React.useState(SaveStatus.NO_STATUS);

  // Grab the principalID that we're currently logged in as.
  const { principalId: sessionPrincipalId } = React.useContext(SessionContext);

  // Grab the API data that we need to render the page. (The page will be
  // rendered with empty data in the meantime.)
  const { data: api_user_data } = useApiData<UserData[]>({
    deps: [sessionPrincipalId],
    path: `/profile/${sessionPrincipalId}`,
    sendCredentials: true,
  });

  // Store what we know about the user into a state variable.
  const [userData, setUserData] = React.useState<UserData>(user_data);

  // Once we get the information back from the API (which we know because
  // api_user_data will have changed in value, triggering this useEffect), set
  // the userData state variable and trigger a re-draw.
  const resetToAPIData = () => {
    user_data = parseServerProfileResponse(api_user_data);
    setUserData(user_data);
    setEditingMode(false);
  };

  useEffect(resetToAPIData, [api_user_data]);

  // In order to load the form elements, we need a list of all possible social
  // networks from which the user can select to enter a social profile.
  const { data: social_networks_list } = useApiData<SocialNetwork[]>({
    path: `/social_networks`,
    sendCredentials: false,
  });

  /**
   * This function determines which message to show the user: a time-of-day-
   * based greeting or a status update about whether or not their edited
   * information is being saved.
   *
   * @param save_status The current status of the page's save operation.
   * @returns The message that is displayed to the user at the top of the page.
   */
  const userMessage = (save_status: SaveStatus) => {
    switch (save_status) {
      case SaveStatus.NO_STATUS:
        return getGreeting(userData.full_name);
      case SaveStatus.SAVING:
        return '📝 Saving...';
      case SaveStatus.SAVED:
        return '✅ Saved successfully.';
      case SaveStatus.SAVE_FAILURE:
        return '❌ Error occurred while trying to save edits.';
      default:
        return '';
    }
  };

  /**
   * The updateUser function should get called when the user submits the edit
   * form on the page. This sends the userData object back to the API, which
   * detects which fields have been edited and updates the database
   * accordingly.
   *
   * @param event Save event to be suppressed.
   */
  const updateUser = (event: React.MouseEvent) => {
    event.preventDefault();
    let submittedUserData = userData;

    setSaveStatus(SaveStatus.SAVING);

    fetch(`${process.env.REACT_APP_API_ORIGIN}/profile/${sessionPrincipalId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [submittedUserData],
        summary: {
          total_count: 1,
        },
      }),
    })
      .then(res => res.json())
      .then(({ data, error }) => {
        // We will briefly show the save success/failure status, then revert
        // back to the greeting after SAVE_STATUS_DELAY seconds.
        setTimeout(() => {
          setSaveStatus(SaveStatus.NO_STATUS);
        }, SAVE_STATUS_DELAY);

        if (error) {
          // handle error other than console.error
          setSaveStatus(SaveStatus.SAVE_FAILURE);
        }
        if (data) {
          setSaveStatus(SaveStatus.SAVED);
          setEditingMode(false);
          setUserData(prev => {
            return { ...prev, userData: submittedUserData };
          });
        }
      })
      .catch(error => {
        // top-level error catch
        console.error('uncaught error', error);
      });
  };

  return (
    <Container fixed>
      <p>{sessionPrincipalId === userData.id ? userMessage(saveStatus) : ''}</p>
      <Grid
        container
        justifyContent={{ md: 'center', sm: 'flex-start' }}
        sx={{
          marginTop: '1em',
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
            {editingMode ? (
              <TextField
                id="full-name"
                label="Full Name"
                fullWidth
                variant="filled"
                value={userData?.full_name}
                margin="normal"
              />
            ) : (
              <>
                <Typography component="h2" variant="h4">
                  {userData.full_name}
                </Typography>
                <Tooltip title="Edit">
                  <IconButton
                    component="button"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setEditingMode(!editingMode);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </>
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
            {editingMode ? (
              <UserProfileEditingForm
                networksList={social_networks_list}
                userData={userData}
                setUserData={setUserData}
              />
            ) : (
              <UserProfileSocialLinks profileList={userData.social_profiles} />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" sx={{ maxWidth: '80%', margin: '35px auto' }} />
      <Grid container justifyContent="center" spacing={4}>
        <Grid item md={12}>
          <Typography component="h3" variant="h4" sx={{ my: 2 }}>
            Summary
          </Typography>
          {editingMode ? (
            <Typography component="div">
              <TextField
                id="filled-basic"
                label="User bio"
                fullWidth
                multiline
                rows={4}
                variant="filled"
                value={userData.bio}
                margin="normal"
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={updateUser}>
                  Submit Edits
                </Button>
                <Button variant="outlined" onClick={resetToAPIData}>
                  Cancel Editing
                </Button>
              </Stack>
            </Typography>
          ) : (
            <Typography component="div">{userData.bio}</Typography>
          )}
        </Grid>
        {editingMode ? (
          ''
        ) : (
          <>
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
          </>
        )}
      </Grid>
    </Container>
  );
};

export default UserProfile;
