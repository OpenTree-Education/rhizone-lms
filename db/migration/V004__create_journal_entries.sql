CREATE TABLE journal_entries (
  id BIGSERIAL PRIMARY KEY,
  raw_text TEXT NOT NULL,
  principal_id BIGINT NOT NULL REFERENCES principals(id),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT current_timestamp
);
