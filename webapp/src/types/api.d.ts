export type EntityId = number | string | null | undefined;

export interface Entity {
  id: EntityId;
}

export interface CreationResponseEnvelope {
  data: Entity;
}

export interface APIError {
  message: string;
}
export interface Doc {
  id: EntityId;
  slug: string;
  title: string;
  content: string;
}
export interface Competency extends Entity {
  label: string;
  description: string;
  principal_id: number;
}
export interface Prompt extends Entity {
  label: string;
  options: Option[];
  query_text: string;
}

export interface Option extends Entity {
  label: string;
  prompt: Prompt;
}

export interface Questionnaire extends Entity {
  prompts: Prompt[];
}

export interface Response extends Entity {
  option: Option;
}

export interface JournalEntry extends Entity {
  raw_text: string;
}

export interface Reflection extends Entity {
  created_at: string;
  journal_entries: JournalEntry[];
  responses: Response[];
}

export interface Participant extends Entity {
  principal_id: EntityId;
}

export interface Meeting extends Entity {
  starts_at: string;
  participants: Participant[];
  meeting_notes: MeetingNote[];
}

export interface MeetingNote extends Entity {
  note_text: string;
  sort_order: number;
  authoring_participant_id: EntityId;
  agenda_owning_participant_id: EntityId;
}

export interface SessionData extends Entity {
  principal_id: EntityId;
}

export interface Settings extends Entity {
  default_questionnaire_id: EntityId;
}
