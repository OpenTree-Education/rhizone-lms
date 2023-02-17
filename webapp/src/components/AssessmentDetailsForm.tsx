import * as React from 'react';
import Grid from '@mui/material/Grid';
import dayjs, { Dayjs } from 'dayjs';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function AssessmentDetailsForm() {
  const [value, setValue] = React.useState('quiz');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [valueDayjs, setValueDayjs] = React.useState<Dayjs | null>(
    dayjs('2014-08-18T21:11:54'),
  );

  const handleChangeDayjs = (newValue: Dayjs | null) => {
    setValueDayjs(newValue);
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Assessment details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Title"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
        <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
            row
          >
          <FormControlLabel value="quiz" control={<Radio />} label="Quiz" />
          <FormControlLabel value="assignment" control={<Radio />} label="Assignment" />
        </RadioGroup>
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid item xs={12} sm={6}>

          <DateTimePicker
            label="Start Date and Time"
            value={valueDayjs}
            onChange={handleChangeDayjs}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
       <DateTimePicker
            label="Due Date and Time"
            value={valueDayjs}
            onChange={handleChangeDayjs}
            renderInput={(params) => <TextField {...params} />}
          />
       </Grid>
           </LocalizationProvider>
      </Grid>
    </React.Fragment>
  );
}