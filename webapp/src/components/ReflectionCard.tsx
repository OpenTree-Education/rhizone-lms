import { Card, CardContent, Chip } from '@mui/material';
import React from 'react';

import { formatDateTime } from '../helpers/dateTime';
import { JournalEntry, Response } from '../types/api';

declare interface ReflectionCardProps {
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
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <CardContent>{formatDateTime(createdAt)}</CardContent>
      {responses.map(response => (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <CardContent style={{ padding: '10px' }}>
            {response.option.prompt.label}
          </CardContent>
          <Chip
            label={response.option.label}
            variant="outlined"
            style={{ marginRight: '16px' }}
          />
        </span>
      ))}
    </div>
    {journalEntries.map(({ id, raw_text: rawText }) => (
      <CardContent key={id} sx={{ whiteSpace: 'pre-wrap' }}>
        {rawText}
      </CardContent>
    ))}
  </Card>
);

export default ReflectionCard;
