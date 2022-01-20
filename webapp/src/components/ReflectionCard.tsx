import { Box, Card, CardContent, Chip, Stack } from '@mui/material';
import React from 'react';

import { formatDateTime } from '../helpers/dateTime';
import { JournalEntry, Response } from '../types/api';

interface ReflectionCardProps {
  createdAt: string;
  responses: Response[];
  journalEntries: JournalEntry[];
}

const ReflectionCard = ({
  createdAt,
  journalEntries,
  responses,
}: ReflectionCardProps) => (
  <Card>
    <CardContent>
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        pt={1}
      >
        <Box py={1}>{formatDateTime(createdAt)}</Box>
        <Stack alignItems="flex-end" spacing={2}>
          {responses.map(response => (
            <Stack
              key={response.id}
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Box>{response.option.prompt.label}</Box>
              <Chip label={response.option.label} variant="outlined" />
            </Stack>
          ))}
        </Stack>
      </Stack>
    </CardContent>
    {journalEntries.map(({ id, raw_text: rawText }) => (
      <CardContent key={id}>
        <Box pb={2} sx={{ whiteSpace: 'pre-wrap' }}>
          {rawText}
        </Box>
      </CardContent>
    ))}
  </Card>
);

export default ReflectionCard;
