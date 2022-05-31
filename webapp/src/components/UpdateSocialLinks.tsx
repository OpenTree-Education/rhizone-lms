import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

interface SocialLinksProps {
  socialName: string;
  networkData: string;
}

const UpdateSocialLinks = ({ socialName, networkData }: SocialLinksProps) => {
  const [socialNetworks, setSocialNetworks] = useState(socialName);

  const handleChange = (event: SelectChangeEvent) => {
    setSocialNetworks(event.target.value);
  };

  return (
    <Grid
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        display: 'flex',
        mb: 4,
      }}
    >
      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 100 }}
        disabled={socialName == 'github'}
      >
        {/* <InputLabel id="demo-simple-select-standard-label">
          Social Networks
        </InputLabel> */}
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={socialNetworks}
          onChange={handleChange}
          label="Social Networks"
        >
          <MenuItem value="twitter">Twitter</MenuItem>
          <MenuItem value="linkedIn">LinkedIn</MenuItem>
          <MenuItem value="portfolio">Portfolio</MenuItem>
        </Select>
      </FormControl>
      <TextField
        type="text"
        value={networkData}
        name={socialNetworks}
        variant="standard"
      />
    </Grid>
  );
};
export default UpdateSocialLinks;
