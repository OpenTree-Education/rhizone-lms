import React from 'react'

import { Box, Paper, Grid, TextField, ButtonGroup, Button, styled, MenuList, MenuItem, Popper, Grow, ClickAwayListener } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { WidthFull } from '@mui/icons-material';



const AssessmentEditorPage = () => {
  const options = ['Create Assignment', 'Create Quiz', 'Create Test'];

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };
  const [selectedBtn, setSelectedBtn] = React.useState(-1);
  return(
    <div className={"editor-display-box"}>
      <Box sx={{ flexGrow: 1, boxShadow: 5, margin: 2, paddingLeft: 4, paddingBottom: 4, paddingTop: 3, overflow: 'auto'}}>
        <Grid
          container
          spacing={2}
          alignItems={'center'}
          >
          <Grid xs={12} display={"flex"} justifyContent={"flex-start"}>
            <h1> Create New Assessment </h1>
          </Grid>
          <Grid xs={6} display={"flex"} justifyContent={"flex-start"}>
            <React.Fragment>
              <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                <Button
                  size="small"
                  aria-controls={open ? 'split-button-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              onClick={(event) => handleMenuItemClick(event, index)}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </React.Fragment>
          </Grid>
          <Grid xs={12}>
            <TextField
              id="fullWidth"
              label="Title"
              sx={{ mb: 1, mt: 2, mr: 3}}
              variant="outlined"
              required
            />
          </Grid>
          <Grid xs={5}>
            <TextField
              id="filled-multiline-static"
              label="Description"
              multiline
              rows={4}
              sx={{mb: 1, mt: 1}}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid xs={4}>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AssessmentEditorPage;
