import React from 'react';
import { Dialog } from '@mui/material';

interface ActivityDialogProps {
  show: boolean;
  contents: string;
  handleClose: () => void;
}

const ProgramActivityDialog = ({
  show,
  contents,
  handleClose,
}: ActivityDialogProps) => {
  return (
    // TODO: pass the appropriate props to Dialog for it to display the information you need,
    // then use the other imports to style the Dialog to look more... attractive.
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {contents}
    </Dialog>
  );
};

export default ProgramActivityDialog;
