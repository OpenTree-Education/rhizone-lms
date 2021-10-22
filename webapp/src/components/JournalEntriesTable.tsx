import React from 'react';

import { JournalEntry } from '../types/api';

interface JournalEntriesTableProps {
  journalEntries: JournalEntry[];
}

const JournalEntriesTable = ({ journalEntries }: JournalEntriesTableProps) => (
  <table>
    <tbody>
      {journalEntries.map(({ id, raw_text: rawText }) => (
        <tr key={id}>
          <td>{rawText}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default JournalEntriesTable;
