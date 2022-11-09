CREATE TABLE curriculums (
  id BIGINT NOT NULL AUTO_INCREMENT,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  INDEX curriculums_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  PRIMARY KEY (id)
);


CREATE TABLE programs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  principal_id BIGINT NOT NULL,
  curriculum_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX programs_curriculum_id (curriculum_id),
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id),
  INDEX programs_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  PRIMARY KEY (id)
);

CREATE TABLE activity_types (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE activities (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(255) NOT NULL,
  description_text TEXT NOT NULL,
  curriculum_week INT NOT NULL,
  curriculum_day INT NOT NULL,
  start_time TIME,
  end_time TIME,
  duration INT,
  activity_type_id BIGINT NOT NULL,
  curriculum_id BIGINT NOT NULL,
  INDEX activities_activity_type_id (activity_type_id),
  FOREIGN KEY (activity_type_id) REFERENCES activity_types(id),
  INDEX activities_curriculum_id (curriculum_id),
  FOREIGN KEY (curriculum_id) REFERENCES curriculums(id),
  PRIMARY KEY (id)
);

CREATE TABLE participant_activities (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  program_id BIGINT NOT NULL,
  activity_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL,
  completed BOOLEAN NOT NULL,
  INDEX participant_activities_program_id (program_id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  INDEX participant_activities_activity_id (activity_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id),
  INDEX participant_activities_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  PRIMARY KEY (id)
);

INSERT INTO activity_types (title) VALUES
  ('class'),
  ('assignment'),
  ('standup'),
  ('retrospective');
