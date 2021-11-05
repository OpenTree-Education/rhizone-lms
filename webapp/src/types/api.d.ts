export interface CreationResponseEnvelope {
  data: {
    id: number;
  };
}

export interface JournalEntry {
  id: number;
  raw_text: string;
  created_at: string;
}
