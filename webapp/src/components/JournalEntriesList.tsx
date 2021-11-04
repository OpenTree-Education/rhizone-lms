import { Card, CardContent, Stack } from '@mui/material';
import React from 'react';

import { JournalEntry } from '../types/api';

import { formatDateTime } from '../helpers/dateTime';

interface JournalEntriesListProps {
  journalEntries: JournalEntry[];
}

const JournalEntriesList = ({ journalEntries }: JournalEntriesListProps) => (
  <>
    <h2>Your previous entries</h2>
    <Stack spacing={2}>
      {journalEntries.map(
        ({ id, raw_text: rawText, created_at: createdAt }) => {
          return (
            <Card key={id}>
              <CardContent>{formatDateTime(createdAt)}</CardContent>
              <CardContent
                sx={{
                  whiteSpace: 'pre-wrap',
                }}
              >
                {rawText}
              </CardContent>
            </Card>
          );
        }
      )}
    </Stack>
  </>
);

export default JournalEntriesList;
