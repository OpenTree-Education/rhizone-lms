ALTER TABLE `github_users`
  ADD COLUMN username VARCHAR(255),
  DROP COLUMN email;

ALTER TABLE `principals`
  ADD COLUMN `full_name` VARCHAR(255),
  ADD COLUMN `bio` TEXT,
  ADD COLUMN `avatar_url` VARCHAR(255),
  ADD COLUMN `email_address` VARCHAR(255);