ALTER TABLE competencies
  ADD COLUMN category_id BIGINT,
  ADD FOREIGN KEY (category_id) REFERENCES categories(id);
