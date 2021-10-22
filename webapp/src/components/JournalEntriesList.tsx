import { Card, CardContent, Stack } from '@mui/material';
import React from 'react';

import { JournalEntry } from '../types/api';

interface JournalEntriesTableProps {
  journalEntries: JournalEntry[];
}

const JournalEntriesList = ({ journalEntries }: JournalEntriesTableProps) => (
  <>
    <h2>Your previous entries</h2>
    <Stack spacing={2}>
      {journalEntries.map(({ id, raw_text: rawText }) => (
        <Card key={id}>
          <CardContent>{rawText}</CardContent>
        </Card>
      ))}
    </Stack>
  </>
);

export default JournalEntriesList;
