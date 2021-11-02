import { Card, CardContent, Stack } from '@mui/material';
import React from 'react';

import { JournalEntry } from '../types/api';

interface JournalEntriesListProps {
  journalEntries: JournalEntry[];
}

const JournalEntriesList = ({ journalEntries }: JournalEntriesListProps) => (
  <>
    <h2>Your previous entries</h2>
    <Stack spacing={2}>
      {journalEntries.map(({ id, raw_text: rawText, created_at: createdAt }) => {
        const date = new Date(createdAt);

        return (  
          <Card key={id}>
            <CardContent>
              {new Intl.DateTimeFormat([], 
              { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric', 
              }).format(date)}
            </CardContent>
            <CardContent>{rawText}</CardContent>
          </Card>
        )
      })}
    </Stack>
  </>
);

export default JournalEntriesList;
