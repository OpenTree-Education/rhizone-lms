CREATE TABLE github_users (
  id BIGSERIAL PRIMARY KEY,
  github_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL REFERENCES principals(id),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT current_timestamp
);
