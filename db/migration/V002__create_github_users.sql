CREATE TABLE github_users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  github_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX github_users_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id)
);
