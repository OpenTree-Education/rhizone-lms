ALTER TABLE competencies
  ADD COLUMN category_id BIGINT,
  ADD INDEX competencies_category_id (category_id),
  ADD FOREIGN KEY (category_id) REFERENCES categories(id);
