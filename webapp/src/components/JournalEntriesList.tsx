import { Card, CardContent, Stack, Chip } from '@mui/material';
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
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <CardContent>{formatDateTime(createdAt)}</CardContent>
                <span style={{display: 'flex', alignItems: 'center'}}>
                  <CardContent style={{ padding: '10px'}}>OUTLOOK</CardContent>
                  <Chip label="HARD CODED ANSWER" variant="outlined" style={{ marginRight: '16px' }}/>
                </span>
              </div>
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
