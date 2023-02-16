-- Create 'participants_questionnaire' table
CREATE TABLE participants_questionnaire (
  id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  questionnaire_id BIGINT NOT NULL,
  option_answer_id BIGINT NOT NULL,
  participants_id BIGINT NOT NULL,
  prompt_text VARCHAR(255),
  score BIGINT,
  comment_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  -- CONSTRAINT fk_participants_questionnaire_questionnaire_id
  --   FOREIGN KEY (questionnaire_id)
  --   REFERENCES questionnaires(id)
  --   ON DELETE CASCADE,
  -- CONSTRAINT fk_participants_questionnaire_option_answer_id
  --   FOREIGN KEY (option_answer_id)
  --   REFERENCES options_answer(id)
  --   ON DELETE CASCADE,
  -- CONSTRAINT fk_participants_questionnaire_participants_id
  --   FOREIGN KEY (participants_id)
  --   REFERENCES participantss(id)
  --   ON DELETE CASCADE,

