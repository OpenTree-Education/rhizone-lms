
CREATE TABLE assessment_question_types (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE assessment_submission_states (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE program_participant_roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE program_participants (
  id BIGINT NOT NULL AUTO_INCREMENT,
  principal_id BIGINT NOT NULL,
  program_id BIGINT NOT NULL,
  role_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX program_participants_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  INDEX program_participants_program_id (program_id),
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX program_participants_role_id (role_id),
  FOREIGN KEY (role_id) REFERENCES program_participant_roles(id) ON DELETE SET NULL,
  PRIMARY KEY (id),
  UNIQUE KEY `principals_and_programs` (`principal_id`,`program_id`)
);

CREATE TABLE curriculum_assessments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  max_score INT,
  max_num_submissions INT NOT NULL DEFAULT 1,
  time_limit INT,
  curriculum_id BIGINT NOT NULL,
  activity_id BIGINT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX curriculum_assessments_curriculum_id (curriculum_id),
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id) ON DELETE CASCADE,
  INDEX curriculum_assessments_activity_id (activity_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL,
  INDEX curriculum_assessments_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  PRIMARY KEY (id)
);

CREATE TABLE program_assessments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  program_id BIGINT NOT NULL,
  assessment_id BIGINT NOT NULL,
  available_after TIMESTAMP NOT NULL,
  due_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX program_assessments_program_id (program_id),
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  INDEX program_assessments_assessment_id (assessment_id),
  FOREIGN KEY (assessment_id) REFERENCES curriculum_assessments(id) ON DELETE CASCADE,
  PRIMARY KEY (id),
  UNIQUE KEY `program_and_assessment` (`program_id`,`assessment_id`)
);

CREATE TABLE assessment_questions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  assessment_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessment_question_type_id BIGINT NOT NULL,
  correct_answer_id BIGINT,
  max_score INT,
  sort_order INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX assessment_answers_assessment_question_id (assessment_id),
  FOREIGN KEY (assessment_id) REFERENCES curriculum_assessments(id) ON DELETE CASCADE,
  INDEX assessment_questions_assessment_question_type_id (assessment_question_type_id),
  FOREIGN KEY (assessment_question_type_id) REFERENCES assessment_question_types(id),
  PRIMARY KEY (id),
  UNIQUE KEY `assessment_and_question_number` (`assessment_id`,`sort_order`)
);

CREATE TABLE assessment_answers (
  id BIGINT NOT NULL AUTO_INCREMENT,
  question_id BIGINT,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX assessment_answers_question_id (question_id),
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id) ON DELETE CASCADE,
  PRIMARY KEY (id),
  UNIQUE KEY `question_and_answer_order` (`question_id`,`sort_order`)
);

CREATE TABLE assessment_submissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  assessment_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL,
  assessment_submission_state_id BIGINT NOT NULL,
  score INT,
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX assessment_submissions_assessment_id (assessment_id),
  FOREIGN KEY (assessment_id) REFERENCES program_assessments(id),
  INDEX assessment_submissions_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  INDEX assessment_submissions_assessment_submission_state_id (assessment_submission_state_id),
  FOREIGN KEY (assessment_submission_state_id) REFERENCES assessment_submission_states(id),
  PRIMARY KEY (id)
);

CREATE TABLE assessment_responses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  assessment_id BIGINT NOT NULL,
  submission_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer_id BIGINT,
  response TEXT,
  score INT,
  grader_response TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX assessment_responses_assessment_id (assessment_id),
  FOREIGN KEY (assessment_id) REFERENCES program_assessments(id),
  INDEX assessment_responses_submission_id (submission_id),
  FOREIGN KEY (submission_id) REFERENCES assessment_submissions(id),
  INDEX assessment_responses_question_id (question_id),
  FOREIGN KEY (question_id) REFERENCES assessment_questions(id),
  INDEX assessment_responses_answer_id (answer_id),
  FOREIGN KEY (answer_id) REFERENCES assessment_answers(id) ON DELETE SET NULL,
  PRIMARY KEY (id),
  UNIQUE KEY `submission_and_question` (`submission_id`,`question_id`)
);

ALTER TABLE questionnaires
RENAME TO surveys;

ALTER TABLE prompts
RENAME TO survey_questions;

ALTER TABLE options
RENAME TO survey_answers;
