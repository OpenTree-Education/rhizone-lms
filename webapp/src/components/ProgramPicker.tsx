import React from 'react';
import {
  Select,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

import { formatDate } from '../helpers/dateTime';
import { ProgramWithActivities } from '../types/api';

interface ProgramPickerProps {
  programs: ProgramWithActivities[];
  selectedProgram: number;
  setSelectedProgram: React.Dispatch<React.SetStateAction<number>>;
}

const ProgramPicker = ({
  programs,
  selectedProgram,
  setSelectedProgram,
}: ProgramPickerProps) => {
  const changeProgram = (event: SelectChangeEvent) => {
    setSelectedProgram(parseInt(event.target.value));
  };

  return (
    <FormControl sx={{ my: 3, minWidth: { xs: 320, md: 450 }, maxWidth: { xs: 340, md: 600 }, alignSelf: { xs: 'center' } }}>
      <InputLabel id="program-select-label">Program</InputLabel>
      <Select
        labelId="program-select-label"
        id="program-select"
        value={selectedProgram.toString()}
        label="Program"
        onChange={changeProgram}
      >
        {programs.map((program, index) => (
          <MenuItem value={index} key={index} sx={{ fontSize: { xs: '0.85rem' } }}>
            <strong>{program.title}</strong>&nbsp; (
            {formatDate(program.start_date)} &ndash;{' '}
            {formatDate(program.end_date)})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProgramPicker;
