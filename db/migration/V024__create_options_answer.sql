-- Create 'options_answer' table
CREATE TABLE options_answer (
  id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  question_id BIGINT NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  answer_text VARCHAR(255) NOT NULL
);
  -- CONSTRAINT fk_options_answer_question_id
  --   FOREIGN KEY (question_id)
  --   REFERENCES questions(id)
  --   ON DELETE CASCADE


