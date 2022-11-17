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
  start_time: Date;
  end_time: Date;
  duration: number; // if duration is '0', it's an all-day event
}

export interface ProgramWithActivities extends Program {
  activities: ProgramActivity[];
}

// TODO: define ActivityType structure
export interface ActivityType {
  id: number;
  // TODO: fill the rest in here.
}
