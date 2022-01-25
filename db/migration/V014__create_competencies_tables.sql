CREATE TABLE competencies (
  id BIGINT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX competencies_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id)
);

CREATE TABLE model_competencies (
  id BIGINT NOT NULL AUTO_INCREMENT,
  principal_id BIGINT NOT NULL,
  competency_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX model_competencies_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  INDEX model_competencies_competency_id (competency_id),
  FOREIGN KEY (competency_id) REFERENCES competencies(id),
  UNIQUE (principal_id, competency_id)
);
