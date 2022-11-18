export interface Program {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  principal_id: number;
  curriculum_id: number;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: number;
  title: string;
  principal_id: number;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface ProgramActivity {
  title: string;
  description_text: string;
  program_id: number;
  curriculum_activity_id: number;
  activity_type: string;
  start_time: Date | string;
  end_time: Date | string;
  duration: number; // if duration is '0', it's an all-day event
}

export interface ProgramWithActivities extends Program {
  activities: ProgramActivity[];
}

export interface ActivityType {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}
