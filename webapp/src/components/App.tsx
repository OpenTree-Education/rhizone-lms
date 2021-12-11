import { Box, Container, Typography } from '@mui/material';

import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import MeetingsDrawer from './MeetingsDrawer';
import Reflections from './Reflections';

interface AppState {
  loggedIn: boolean | null;
  isMeetingDrawerOpen: boolean;
}

interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      loggedIn: null,
      isMeetingDrawerOpen: false,
    };

    this.updateLoggedIn = this.updateLoggedIn.bind(this);
  }

  async componentDidMount() {
    const fetchSessionInfo = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/session`,
      { credentials: 'include' }
    );
    if (fetchSessionInfo.ok) {
      const { data: sessionInfo } = await fetchSessionInfo.json();
      this.setState({ loggedIn: sessionInfo.authenticated });
    }
  }

  handleCalendarClick = () => {
    this.setState({ isMeetingDrawerOpen: !this.state.isMeetingDrawerOpen });
  };

  updateLoggedIn = (isLoggedIn: boolean) => {
    this.setState({ loggedIn: isLoggedIn });
  };

  render() {
    return (
      <div>
        <Navbar
          loggedIn={this.state.loggedIn}
          handleCalendarClick={this.handleCalendarClick}
        />
        <MeetingsDrawer
          open={this.state.isMeetingDrawerOpen}
          handleCalendarClick={this.handleCalendarClick}
          loggedIn={this.state.loggedIn}
          updateLoggedIn={this.updateLoggedIn}
        />

        <Container fixed>
          <Router>
            <Routes>
              {this.state.loggedIn ? (
                <Route
                  path="/"
                  element={<Reflections updateLoggedIn={this.updateLoggedIn} />}
                />
              ) : (
                ''
              )}
            </Routes>
          </Router>
          <Box sx={{ my: 12 }}>
            <Typography align="center">
              <small>© OpenTree Education Inc.</small>
            </Typography>
          </Box>
        </Container>
      </div>
    );
  }
}

export default App;
