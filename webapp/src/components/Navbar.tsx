import { Button, Grid } from '@mui/material';
import React, {Component} from 'react';

interface NavbarProps {
  loggedIn: boolean | null;
}

class Navbar extends Component<NavbarProps> {
  constructor(props: NavbarProps) {
    super(props);
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
            <Button
              component="a"
              href={`${process.env.REACT_APP_API_ORIGIN}/auth/logout`}
            >
              Sign Out
            </Button>
          )}
        </Grid>
      </Grid>
    )
  }
}


export default Navbar;
