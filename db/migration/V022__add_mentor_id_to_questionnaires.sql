-- Add 'mentor_id' column to 'questionnaires' table
ALTER TABLE questionnaires
ADD COLUMN mentor_id BIGINT NOT NULL DEFAULT 0;

-- Add foreign key constraint for 'mentor_id' column
-- ALTER TABLE questionnaires
-- ADD CONSTRAINT fk_questionnaires_mentor_id
-- FOREIGN KEY (mentor_id) REFERENCES principals(id);


