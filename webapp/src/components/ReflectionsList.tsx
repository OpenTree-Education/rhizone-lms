import { Card, CardContent, Stack, Chip } from '@mui/material';
import React from 'react';

import { Reflection } from '../types/api';

import { formatDateTime } from '../helpers/dateTime';

interface ReflectionsListProps {
  reflections: Reflection[];
}

const ReflectionsList = ({ reflections }: ReflectionsListProps) => (
  <>
    <h2>Your previous entries</h2>
    <Stack spacing={2}>
      {reflections.map(
        ({
          id,
          created_at: createdAt,
          journal_entries: journalEntries,
          responses,
        }) => {
          return (
            <Card key={id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CardContent>{formatDateTime(createdAt)}</CardContent>
                {responses.map(response => {
                  return (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <CardContent style={{ padding: '10px' }}>
                        {response['option']['prompt']['label']}
                      </CardContent>
                      <Chip
                        label={response['option']['label']}
                        variant="outlined"
                        style={{ marginRight: '16px' }}
                      />
                    </span>
                  );
                })}
              </div>
              {journalEntries.map(({ id, raw_text: rawText }) => (
                <CardContent
                  key={id}
                  sx={{
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {rawText}
                </CardContent>
              ))}
            </Card>
          );
        }
      )}
    </Stack>
  </>
);

export default ReflectionsList;
