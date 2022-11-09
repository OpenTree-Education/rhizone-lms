INSERT INTO curriculums (principal_id, title) VALUES
  (1, 'Professional Mentorship Program');
INSERT INTO activities (title, description_text, curriculum_week, curriculum_day, start_time, end_time, duration, activity_type_id, curriculum_id) VALUES
  ('Set up local copy of repository', 'Clone the repository and follow the instructions to set it up on your development machine.', 1, 1, NULL, NULL, NULL, 2, 1),  
  ('Morning standup', '', 1, 1, '10:00:00', '11:00:00', 60, 3, 1);