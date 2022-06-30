CREATE TABLE categories_questionnaires (
  id BIGINT NOT NULL AUTO_INCREMENT, 
  category_id BIGINT NOT NULL,
  questionnaire_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  INDEX categories_questionnaires_category_id (category_id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX categories_questionnaires_questionnaire_id (questionnaire_id),
  FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id)
);
