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
        
        return (  
          <Card key={id}>
            <CardContent>{createdAt}</CardContent>
            <CardContent>{new Intl.DateTimeFormat([], { dateStyle: 'full', timeStyle: 'full' }).format(parseInt(createdAt))}</CardContent>
            <CardContent>{rawText}</CardContent>
          </Card>
        )
      })}
    </Stack>
  </>
);

export default JournalEntriesList;
