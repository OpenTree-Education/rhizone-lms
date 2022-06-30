import {
  Backdrop,
  Box,
  Button,
  Fade,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const InformationalCard = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {!open ? (
        <Button onClick={handleOpen} sx={{ textTransform: 'none' }}>
          Need help with rating?
        </Button>
      ) : (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                5-level proficiency rating:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Awareness"
                    secondary="You are aware of the competency but are unable
                      to perform tasks."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Novice (limited proficiency)"
                    secondary="You understand and can discuss terminology, concepts, and
                      issues."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Intermediate proficiency"
                    secondary="You have applied this skill to situations
                          occasionally without needing guidance."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Advanced proficiency"
                    secondary="You can coach others in the application by explaining
                          related nuances."
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Expert"
                    secondary="You have demonstrated consistent
                          excellence across multiple projects."
                  />
                </ListItem>
              </List>
            </Box>
          </Fade>
        </Modal>
      )}
    </>
  );
};

export default InformationalCard;
