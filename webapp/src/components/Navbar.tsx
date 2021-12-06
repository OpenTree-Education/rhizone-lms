import { Button, Grid, IconButton } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';

import React, {Component} from 'react';

interface NavbarState {
  drawerOpen: boolean
}

interface NavbarProps {
  loggedIn: boolean | null;
}

class Navbar extends Component<NavbarProps, NavbarState> {
  constructor(props: NavbarProps) {
    super(props);
    this.state = {
      drawerOpen: false
    }
  }

  render() {
    return (
      <Grid alignItems="center" container>
        <Grid item xs>
          <h1>Rhizone</h1>
        </Grid>
        <Grid item xs="auto">
          {this.props.loggedIn === false && (
            <Button
              component="a"
              href={`${process.env.REACT_APP_API_ORIGIN}/auth/github/login`}
              variant="contained"
            >
              Sign In
            </Button>
          )}
          {this.props.loggedIn === true && (
            <div>
              <IconButton
                sx={{mr: 1}}
                onClick={() =>
                  this.setState({ drawerOpen: !this.state.drawerOpen })
                }
              >
                <EventNoteIcon />
              </IconButton>
              <Button
                component="a"
                href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}
              >
                Sign Out
              </Button>

            </div>
          )}
        </Grid>
      </Grid>
    )
  }
}


export default Navbar;
