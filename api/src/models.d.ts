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
