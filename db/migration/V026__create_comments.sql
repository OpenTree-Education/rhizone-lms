-- Create 'comments' table
CREATE TABLE comments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  question_id BIGINT NOT NULL,
  principals_id BIGINT NOT NULL,
  comment_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
  -- CONSTRAINT fk_comments_question_id
  --   FOREIGN KEY (question_id)
  --   REFERENCES questions(id)
  --   ON DELETE CASCADE,
  -- CONSTRAINT fk_comments_principals_id
  --   FOREIGN KEY (principals_id)
  --   REFERENCES principals(id)
  --   ON DELETE CASCADE

