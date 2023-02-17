import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import { Container, Grid } from '@mui/material';
import Box from '@mui/material/Box';

import { containerClasses } from '@mui/system';

export default function ErrorRadios() {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <Grid container justifyContent="center">
        <Box component="span" sx={{ p: 2, border: '1px dashed grey' }}>
        <form onSubmit={handleSubmit}>
        <FormControl sx={{ m: 3 }} error={error} variant="standard">
            <FormLabel id="demo-error-radios">Pop quiz: MUI is...</FormLabel>
            <RadioGroup
            aria-labelledby="demo-error-radios"
            name="quiz"
            value={value}
            onChange={handleRadioChange}
            >
            <FormControlLabel value="best" control={<Radio />} label="The best!" />
            <FormControlLabel value="worst" control={<Radio />} label="The worst." />
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
            Check Answer
            </Button>
        </FormControl>
        </form>
        </Box>
    </Grid>
  );
}
