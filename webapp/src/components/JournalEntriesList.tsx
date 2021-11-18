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
        ({
          id,
          created_at: createdAt,
          journal_entries: journalEntriesPlaceholder,
          responses,
        }) => {
          return (
            <Card key={id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CardContent>{formatDateTime(createdAt)}</CardContent>
                {responses[0]['id'] !== null &&
                  responses.map(response => {
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
              {journalEntriesPlaceholder[0]['id'] !== null &&
                journalEntriesPlaceholder.map(journalEntry => {
                  return (
                    <CardContent
                      sx={{
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {journalEntry['raw_text']}
                    </CardContent>
                  );
                })}
            </Card>
          );
        }
      )}
    </Stack>
  </>
);

export default JournalEntriesList;
