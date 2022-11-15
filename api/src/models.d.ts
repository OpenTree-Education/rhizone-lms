export interface Program {
  id: number;
  principal_id: number;
  curriculum_id: number;
  title: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Curriculum {
  id: number;
  principal_id: number;
  created_at: string;
  updated_at: string;
  title: string;
}

export interface CurriculumActivity {
  id: number;
  created_at: string;
  updated_at: string;
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

export interface ProgramActivity {
  program_id: number;
  activity_type: string;
  start_time?: Date;
  end_time?: Date;
  duration?: number;
  title: string;
  description_text: string;
}

export interface ProgramWithActivities extends Program {
  activities: ProgramActivity[];
}
