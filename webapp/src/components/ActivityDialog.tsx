import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ActivityDialogProps {
  show: boolean;
  contents: string;
  handleClose: () => void;
}

const ActivityDialog = ({ show, contents, handleClose }: ActivityDialogProps) => {



  return (
    // TODO: pass the appropriate props to Dialog for it to display the information you need,
    // then use the other imports to style the Dialog to look more... attractive.
    <Dialog
    open={show}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    
    >{contents}</Dialog>
  )
};

export default ActivityDialog;