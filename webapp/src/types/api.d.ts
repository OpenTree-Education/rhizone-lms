import { Event as RBCEvent } from 'react-big-calendar';

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
  created_at: string;
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

export interface ProgramActivity {
  title: string;
  description_text: string;
  program_id: number;
  curriculum_activity_id: number;
  activity_type: string;
  start_time: string;
  end_time: string;
  duration: number;
  completed: boolean | null;
}

export interface ProgramWithActivities extends Entity {
  title: string;
  start_date: string;
  end_date: string;
  time_zone: string;
  curriculum_id: number;
  activities: ProgramActivity[];
}

export interface Curriculum extends Entity {
  title: string;
  principal_id: number;
}

export interface CurriculumActivity extends Entity {
  title: string;
  description_text: string;
  curriculum_week: number;
  curriculum_day: number;
  start_time: string | null;
  end_time: string | null;
  duration: number | null;
  activity_type_id: number;
  curriculum_id: number;
}

export interface CalendarEvent extends RBCEvent {
  description: string;
  activity_type: string;
  program_title: string;
  program_id: number;
  curriculum_activity_id: number;
  completed?: boolean | null;
}

export interface ParticipantActivityCompletionStatus {
  activity_id: number;
  completed: boolean;
}

export interface ParticipantActivityForProgram {
  program_id: number;
  participant_activities: ParticipantActivityCompletionStatus[];
}

export interface ProgramParticipantCompletionSummary {
  program: Program;
  principal_id: number;
  total_score: number;
}

export interface Answer extends Entity {
  question_id?: number;
  title: string;
  description?: string;
  sort_order: number;
  correct_answer?: boolean;
}

export interface Question extends Entity {
  assessment_id?: number;
  title: string;
  description?: string;
  question_type: string;
  answers?: Answer[];
  correct_answer_id?: number;
  max_score: number;
  sort_order: number;
}

export interface AssessmentResponse extends Entity {
  assessment_id: number;
  submission_id: number;
  question_id: number;
  answer_id?: number;
  response_text?: string;
  score?: number;
  grader_response?: string;
}

export interface AssessmentSubmission extends Entity {
  assessment_id: number;
  principal_id: number;
  assessment_submission_state: string;
  score?: number;
  opened_at: string;
  submitted_at?: string;
  responses?: AssessmentResponse[];
}

export interface AssessmentSubmissionsSummary {
  principal_id: number;
  highest_state: string;
  total_num_submissions: number;
  most_recent_submitted_date?: string;
  highest_score?: number;
}

export interface FacilitatorAssessmentSubmissionsSummary {
  num_participants_with_submissions: number;
  num_program_participants: number;
  num_ungraded_submissions: number;
}

export interface CurriculumAssessment extends Entity {
  title: string;
  assessment_type: string;
  description?: string;
  max_score: number;
  max_num_submissions: number;
  time_limit?: number;
  curriculum_id: number;
  activity_id: number;
  principal_id: number;
  questions?: Question[];
}

export interface ProgramAssessment extends Entity {
  program_id: number;
  assessment_id?: number;
  available_after: string;
  due_date: string;
}

export interface AssessmentDetails {
  curriculum_assessment: CurriculumAssessment;
  program_assessment: ProgramAssessment;
}

interface AssessmentWithRole extends AssessmentDetails {
  principal_program_role: string;
}

export interface AssessmentWithSummary extends AssessmentWithRole {
  participant_submissions_summary?: ParticipantAssessmentSubmissionsSummary;
  facilitator_submissions_summary?: FacilitatorAssessmentSubmissionsSummary;
}

export interface SavedAssessment extends AssessmentWithRole {
  submission: AssessmentSubmission;
}

export interface AssessmentWithSubmissions extends AssessmentWithRole {
  submissions: AssessmentSubmission[];
}
