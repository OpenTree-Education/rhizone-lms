import { Button, Grid, IconButton, Drawer, List } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote'; //navbar meeting icon

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
              <Drawer
                variant="persistent"
                anchor="right"
                open={this.state.drawerOpen}
                transitionDuration={400}
              >
                <List sx={{ width: ['100vw', '350px'], pt: 0 }}>

                </List>
              </Drawer>
            </div>
          )}
        </Grid>
      </Grid>
    )
  }
}


export default Navbar;
