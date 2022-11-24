import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ProgramActivity } from '../types/api';

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
      <h1>Title: {contents.title}</h1>

      {contents.start_time?.toLocaleDateString() ===
      contents.end_time?.toLocaleDateString() ? (
        <h4>Date: {contents.start_time?.toLocaleDateString()} </h4>
      ) : (
        <h4>
          Date: {contents.start_time?.toLocaleDateString()} -{' '}
          {contents.end_time?.toLocaleDateString()}
        </h4>
      )}
      <h4>
        Time: {contents.start_time?.toLocaleTimeString()} -{' '}
        {contents.end_time?.toLocaleTimeString()}
      </h4>
      <p>Desciption:{contents.description_text}</p>
    </Dialog>
  );
};

export default ActivityDialog;
