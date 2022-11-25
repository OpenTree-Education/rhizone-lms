import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';

interface ActivityDialogProps {
  show: boolean;
  contents: {
    title?: string;
    description_text?: string;
    start_time?: Date;
    end_time?: Date;
  };
  handleClose: () => void;
}

const ActivityDialog = ({
  show,
  contents,
  handleClose,
}: ActivityDialogProps) => {
  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        {contents.title}
      </DialogTitle>

      <Divider />

      <DialogContent>
        {contents.start_time?.toLocaleDateString() ===
        contents.end_time?.toLocaleDateString() ? (
          <DialogContentText id="alert-dialog-description">
            <b>Date:</b> {contents.start_time?.toLocaleDateString()}
          </DialogContentText>
        ) : (
          <DialogContentText id="alert-dialog-description">
            <b>Date:</b> {contents.start_time?.toLocaleDateString()} -{' '}
            {contents.end_time?.toLocaleDateString()}
          </DialogContentText>
        )}
        <DialogContentText id="alert-dialog-description">
          <b>Time:</b> {contents.start_time?.toLocaleTimeString()} -{' '}
          {contents.end_time?.toLocaleTimeString()}
        </DialogContentText>

        <DialogContentText id="alert-dialog-description">
          <b>Desciption:</b> {contents.description_text}
        </DialogContentText>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: 'primary.main',
            color: 'common.white',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'common.white',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityDialog;
