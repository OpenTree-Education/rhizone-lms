-- Add 'is_mentor' column to 'principals' table
ALTER TABLE principals
ADD COLUMN is_mentor BOOLEAN NOT NULL DEFAULT FALSE;
