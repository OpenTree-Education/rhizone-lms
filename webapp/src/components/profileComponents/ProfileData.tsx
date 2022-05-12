import React from 'react';
// Material UI Imports
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { updateNamespaceExportDeclaration } from 'typescript';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '35ch',
      display: 'flex',
    },
  },
}));

const ProfileData = () => {
  const classes = useStyles();
  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off" style={{}}>
        {'Ryan Cohen'}
        <TextField id="outlined-basic" label="Name" variant="outlined" />
        <Button variant="outlined">Submit</Button>
        <TextField id="outlined-basic" label="Email" variant="outlined" />
        <Button variant="outlined">Submit</Button>
        <TextField id="outlined-basic" label="Links" variant="outlined" />
        <Button variant="outlined">Submit</Button>
        <TextField id="outlined-basic" label="Summary/Bio" variant="outlined" />
        <Button variant="outlined">Submit</Button>
        <TextField
          id="outlined-basic"
          label="Future Strengths"
          variant="outlined"
        />
        <Button variant="outlined">Submit</Button>
      </form>
    </div>
  );
};

export default ProfileData;
