-- Create 'questions' table
CREATE TABLE questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  questionnaire_id BIGINT NOT NULL,
  question_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  -- CONSTRAINT fk_questions_questionnaire_id
  --   FOREIGN KEY (questionnaire_id)
  --   REFERENCES questionnaires(id)
  --   ON DELETE CASCADE
);


