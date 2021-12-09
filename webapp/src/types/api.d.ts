export interface CreationResponseEnvelope {
  data: {
    id: number;
  };
}

export interface JournalEntry {
  id: number;
  created_at: string;
  journal_entries: [
    {
      id: number;
      raw_text: string;
    }
  ];
  responses: [
    {
      id: number;
      option: {
        id: number;
        label: string;
        prompt: {
          id: number;
          label: string;
        };
      };
    }
  ];
}

export interface Participant {
  id: number;
  principal_id: number;
}
export interface MeetingInfo {
  id: number;
  starts_at: string;
  participants: Participant[];
}
