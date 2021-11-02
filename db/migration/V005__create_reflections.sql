CREATE TABLE reflections (
  id BIGINT NOT NULL AUTO_INCREMENT,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX reflections_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id)
);

CREATE TABLE questionnaires (
  id BIGINT NOT NULL AUTO_INCREMENT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE prompts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  query_text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  questionnaire_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX prompts_questionnaire_id (questionnaire_id),
  FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);

CREATE TABLE options (
  id BIGINT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  numeric_value INT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  prompt_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX options_prompt_id (prompt_id),
  FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);

CREATE TABLE responses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  option_id BIGINT NOT NULL,
  reflection_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX responses_option_id (option_id),
  FOREIGN KEY (option_id) REFERENCES options(id),
  INDEX responses_reflection_id (reflection_id),
  FOREIGN KEY (reflection_id) REFERENCES reflections(id),
  INDEX responses_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id)
);
