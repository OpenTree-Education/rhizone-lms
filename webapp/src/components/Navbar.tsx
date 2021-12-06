import { Button, Grid, IconButton, Drawer, List, ListItem, Divider, Typography } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote'; //navbar meeting icon
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; //close drawer icon

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
      drawerOpen: true
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
                  <ListItem
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'common.white',
                        p: 1,
                        '&:hover': {
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => this.setState({drawerOpen: false})}
                    >
                      <ArrowRightIcon /> 
                    </ListItem>
                    <Divider />
                    <ListItem
                      sx={{
                        backgroundColor: 'primary.main',
                        py: 2,
                      }}
                    >
                      <Typography variant="h5" sx={{color: 'common.white'}}>Upcoming Meetings</Typography>
                    </ListItem>
                    <Divider />
                    <ListItem
                      sx={{
                        backgroundColor: 'primary.main',
                        py: 2,
                      }}
                    >
                      <Typography variant="h5" sx={{color: 'common.white'}}>Past Meetings</Typography>
                    </ListItem>
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
