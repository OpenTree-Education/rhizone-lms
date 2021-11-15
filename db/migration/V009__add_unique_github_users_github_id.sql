ALTER TABLE github_users
  ADD CONSTRAINT unique_github_id
  UNIQUE (github_id);
