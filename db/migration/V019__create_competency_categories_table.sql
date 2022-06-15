CREATE TABLE categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

ALTER TABLE competencies 
    ADD COLUMN category_id BIGINT,
    ADD INDEX competencies_category_id (category_id),
    ADD FOREIGN KEY (category_id) REFERENCES categories(id);