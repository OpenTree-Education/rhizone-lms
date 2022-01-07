CREATE TABLE sessions (
  sid VARCHAR(255) NOT NULL,
  sess JSON NOT NULL,
  expired DATETIME NOT NULL,
  PRIMARY KEY (sid),
  INDEX sessions_expired_index (expired)
);
