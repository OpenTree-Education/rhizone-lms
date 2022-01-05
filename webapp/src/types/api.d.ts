export interface CreationResponseEnvelope {
  data: {
    id: number;
  };
}

export interface Reflection {
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

export interface Meeting {
  id: number;
  starts_at: string;
  participants: Participant[];
  meeting_notes: Array<MeetingNote>;
}

export interface MeetingNote {
  id: number;
  note_text: string;
  sort_order: number;
  authoring_participant_id: number;
  agenda_owning_participant_id: number | null;
}
