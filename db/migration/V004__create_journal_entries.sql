CREATE TABLE journal_entries (
  id BIGINT NOT NULL AUTO_INCREMENT,
  raw_text TEXT NOT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX journal_entries_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id)
);
