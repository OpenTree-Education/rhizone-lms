INSERT INTO questionnaires () VALUES
  ();
SET @questionnaire_id = LAST_INSERT_ID();
INSERT INTO settings (property, content, category) VALUES
  ('default_questionnaire_id', CAST(@questionnaire_id AS CHAR), 'webapp');
INSERT INTO prompts (label, query_text, sort_order, questionnaire_id) VALUES
  ('Outlook', 'How are you feeling about your current endeavours?', 1, @questionnaire_id);
SET @prompt_id = LAST_INSERT_ID();
INSERT INTO options (label, numeric_value, sort_order, prompt_id) VALUES
  ('Very discouraged', -2, 1, @prompt_id),
  ('A little discouraged', -1, 2, @prompt_id),
  ('I don’t know', 0, 3, @prompt_id),
  ('A little hopeful', 1, 4, @prompt_id),
  ('Very hopeful', 2, 5, @prompt_id);
