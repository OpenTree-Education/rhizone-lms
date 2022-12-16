import React, { Dispatch, SetStateAction } from 'react';
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
  setSelectedProgram: Dispatch<SetStateAction<number>>;
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
    <FormControl
      sx={{
        my: { xs: 2, md: 3 },
        minWidth: { xs: 340, sm: 450 },
        maxWidth: { xs: 340, sm: 600 },
        fontSize: { xs: '0.78rem', sm: '1rem' },
      }}
    >
      <InputLabel id="program-select-label" sx={{ fontSize: 'inherit' }}>
        Program
      </InputLabel>
      <Select
        labelId="program-select-label"
        id="program-select"
        value={selectedProgram.toString()}
        label="Program"
        onChange={changeProgram}
        sx={{ fontSize: 'inherit' }}
      >
        {programs.map((program, index) => (
          <MenuItem
            value={index}
            key={index}
            sx={{ fontSize: { xs: '0.85rem' }, px: { xs: 1, sm: 2 } }}
          >
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
