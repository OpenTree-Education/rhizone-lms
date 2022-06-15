INSERT INTO principals (entity_type, full_name) VALUES
    ('service', 'OpenTree');

INSERT INTO categories (label, description) VALUES
    ('Functional', 'Competencies to perform the activities within an occupation or function to the standard expected in employment; knowledge, skill, method and theory needed to carry out work assignments.'),
    ('Strategic', 'Competencies used to accomplish focused, longer-term goals which include theory and concepts, as well as informal tacit knowledge; ability to learn to perform analytical thinking, planning, and problem-solving'),
    ('Operational', 'Competencies used for daily management of tasks and relationships; the application of knowledge, skills, experience, and behaviours to make competencies operational in work situations'),
    ('Behavioral/Self', 'Competencies to achieve results through self-awareness and, accordingly, by working effectively with others in various circumstances; the ability to develop oneself, initiate action, self-discipline, self-esteem, individuality, and self-determination'),
    ('Organizational', 'Competencies to communicate by various means within different organizational settings; applied knowledge of language and its use in an effective way');

INSERT INTO competencies (label, description, principal_id, category_id) VALUES
    ('Data Structures', 'Knowing how to arrange data on a computer so that it can be accessed and updated efficiently', 1, 1),
    ('Algorithms', 'Knowing about processes or sets of rules to be followed in calculations or other problem-solving operations', 1, 1),
    ('Frameworks', 'Lorem ipsum', 1, 1),
    ('Database', 'Lorem ipsum', 1, 1),
    ('Debugging', 'Lorem ipsum', 1, 1),
    ('Understanding Code', 'Lorem ipsum', 1, 1),
    ('Estimation', 'Reliably predicting how long something will take', 1, 2),
    ('Anticipation', 'Lorem ipsum', 1, 2),
    ('Handling Change', 'Lorem ipsum', 1, 2),
    ('Autonomy', 'Lorem ipsum', 1, 2),
    ('Intuition', 'Lorem ipsum', 1, 2),
    ('Quality Control', 'Lorem ipsum', 1, 3),
    ('Probelm Solving', 'Lorem ipsum', 1, 3),
    ('Documentation', 'Lorem ipsum', 1, 3),
    ('Developing Others', 'Lorem ipsum', 1, 3),
    ('Pair Programming', 'Lorem ipsum', 1, 3),
    ('Self-Awareness', 'Lorem ipsum', 1, 4),
    ('Agency', 'Lorem ipsum', 1, 4),
    ('Honesty', 'Lorem ipsum', 1, 4),
    ('Interpersonal Awareness', 'Lorem ipsum', 1, 4),
    ('Caring Connection', 'Lorem ipsum', 1, 4),
    ('Written Communcation', 'Lorem ipsum', 1, 5),
    ('Client Focus', 'Lorem ipsum', 1, 5),
    ('Providing Feedback', 'Lorem ipsum', 1, 5),
    ('Collaboration', 'Lorem ipsum', 1, 5),
    ('Mentorship', 'Lorem ipsum', 1, 5),
    ('Diplomatic Sensitivity', 'Lorem ipsum', 1, 5);