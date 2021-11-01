CREATE TABLE prompts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  query_text TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT(0),
  questionnaire_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX prompts_questionnaire_id (questionnaire_id),
  FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);