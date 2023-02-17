-- Add 'title' column to 'questionnaires' table
ALTER TABLE questionnaires
ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT "undefined_quiz";
