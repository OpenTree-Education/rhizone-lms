ALTER TABLE github_users
  ADD CONSTRAINT github_id
  UNIQUE (github_id);
  