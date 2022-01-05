export interface CreationResponseEnvelope {
  data: {
    id: number;
  };
}

export type Prompt = {
  id: number;
  label: string;
};

export type Option = {
  id: number;
  label: string;
  prompt: Prompt;
};

export type Response = {
  id: number;
  option: Option;
};

export type JournalEntry = {
  id: number;
  raw_text: string;
};

export interface Reflection {
  id: number;
  created_at: string;
  journal_entries: JournalEntry[];
  responses: Response[];
}

export interface Participant {
  id: number;
  principal_id: number;
}

export interface Meeting {
  id: number;
  starts_at: string;
  participants: Participant[];
  meeting_notes: MeetingNote[];
}

export interface MeetingNote {
  id: number;
  note_text: string;
  sort_order: number;
  authoring_participant_id: number;
  agenda_owning_participant_id: number | null;
}

export interface User {
  principal_id: number | null;
}
