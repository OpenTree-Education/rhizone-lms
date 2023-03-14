export interface Program {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  time_zone: string;
  curriculum_id: number;
  principal_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Curriculum {
  id: number;
  title: string;
  principal_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CurriculumActivity {
  id: number;
  title: string;
  description_text: string;
  curriculum_week: number;
  curriculum_day: number;
  start_time: string | null;
  end_time: string | null;
  duration: number | null;
  activity_type_id: number;
  curriculum_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProgramActivity {
  title: string;
  description_text: string;
  program_id: number;
  curriculum_activity_id: number;
  activity_type: string;
  start_time: string;
  end_time: string;
  duration: number; // if duration is '0', it's an all-day event
}

export interface ProgramWithActivities extends Program {
  activities: ProgramActivity[];
}

export interface ActivityType {
  id: number;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface ParticipantActivity {
  id: number;
  program_id: number;
  activity_id: number;
  principal_id: number;
  completed: boolean;
}

export interface ParticipantActivityCompletionStatus {
  activity_id: number;
  completed: boolean;
}

export interface ParticipantActivityForProgram {
  program_id: number;
  participant_activities: ParticipantActivityCompletionStatus[];
}

export interface Answer {
  id?: number;
  question_id?: number;
  title: string;
  description?: string;
  sort_order: number;
  correct_answer?: boolean;
}

export interface Question {
  id?: number;
  assessment_id?: number;
  title: string;
  description?: string;
  question_type: string;
  answers?: Answer[];
  correct_answer_id?: number;
  max_score: number;
  sort_order: number;
}

export interface CurriculumAssessment {
  id?: number;
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

export interface AssessmentSubmissionsSummary {
  principal_id: number;
  highest_state: string;
  most_recent_submitted_date: string;
  total_num_submissions: number;
  highest_score?: number;
  assessment_submission_state: string;
}

export interface ProgramAssessment {
  id?: number;
  program_id: number;
  assessment_id?: number;
  available_after: string;
  due_date: string;
}

export interface FacilitatorAssessmentSubmissionsSummary {
  num_participants_with_submissions: number;
  num_program_participants: number;
  num_ungraded_submissions: number;
}

export interface AssessmentSummary {
  curriculum_assessment: CurriculumAssessment;
  program_assessment: ProgramAssessment;
  submissions_summary: AssessmentSubmissionsSummary;
  /* | FacilitatorAssessmentSubmissionsSummary;*/
}

export interface AssessmentResponse {
  id?: number;
  assessment_id: number;
  submission_id: number;
  question_id: number;
  answer_id?: number;
  response?: string;
  score?: number;
  grader_response?: string;
}

export interface AssessmentSubmission {
  id?: number;
  assessment_id: number;
  principal_id: number;
  assessment_submission_state: string;
  score?: number;
  opened_at: string;
  submitted_at?: string;
  responses?: AssessmentResponse[];
}

export interface SubmittedAssessment {
  curriculum_assessment: CurriculumAssessment;
  program_assessment: ProgramAssessment;
  submissions: AssessmentSubmission[];
}

export interface ProgramParticipantCompletionSummary {
  program: Program;
  principal_id: number;
  total_score: number;
}
