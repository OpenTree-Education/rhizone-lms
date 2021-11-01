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