import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { Link as GatsbyLink } from 'gatsby';
import Paper from '@mui/material/Paper';
import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

declare interface FormBuilderProps {
  formAction: string;
  formButtonText?: string;
  formFields: {
    label: string;
    required?: boolean;
    type: string;
  }[];
  formHeading?: string;
  formName: string;
}

const FormBuilder = ({
  formAction,
  formButtonText,
  formFields,
  formHeading,
  formName,
}: FormBuilderProps) => (
  <Paper variant="outlined">
    <form action={formAction} data-netlify="true" method="post" name={formName}>
      <Stack p={4} spacing={4}>
        {formHeading && (
          <Typography component="h2" variant="h6">
            {formHeading}
          </Typography>
        )}
        <Typography variant="body2">
          Required fields are marked with asterisks (*).
        </Typography>
        {formFields.map(({ label, required = false, type }) => (
          <FormControl fullWidth key={label}>
            {type === 'textarea' ? (
              <TextField
                label={label}
                minRows={4}
                multiline
                name={label}
                required={required}
                type="text"
              />
            ) : (
              <TextField
                label={label}
                name={label}
                required={required}
                type={type}
              />
            )}
          </FormControl>
        ))}
        <Box>
          <p>
            By submitting this form you agree to the{' '}
            <GatsbyLink to="/privacy-policy/">Privacy Policy</GatsbyLink> of
            this Site.
          </p>
          <p>
            <Button type="submit" variant="contained">
              {formButtonText || 'Submit'}
            </Button>
          </p>
        </Box>
      </Stack>
    </form>
  </Paper>
);

export default FormBuilder;
