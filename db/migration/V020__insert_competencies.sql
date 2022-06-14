INSERT INTO principals (entity_type, full_name) VALUES
    ('service', 'OpenTree');

INSERT INTO categories (label, description) VALUES
    ('Functional', 'Competencies to perform the activities within an occupation or function to the standard expected in employment; knowledge, skill, method and theory needed to carry out work assignments.'),
    ('Strategic', 'Competencies used to accomplish focused, longer-term goals which include theory and concepts, as well as informal tacit knowledge; ability to learn to perform analytical thinking, planning, and problem-solving'),
    ('Operational', 'Competencies used for daily management of tasks and relationships; the application of knowledge, skills, experience, and behaviours to make competencies operational in work situations'),
    ('Behavioral/Self', 'Competencies to achieve results through self-awareness and, accordingly, by working effectively with others in various circumstances; the ability to develop oneself, initiate action, self-discipline, self-esteem, individuality, and self-determination'),
    ('Organizational', 'Competencies to communicate by various means within different organizational settings; applied knowledge of language and its use in an effective way'),
    ('Computer Science', 'Competencies in the study of how and why technologies and algorithmic processes work, including whether and how technology could solve real-life problems based on understanding principles, hardware and software designs, applications, and impact on society and the individual; involves investiagting procedues, creating solutions, learning about computing systems, programming, data and networks'),
    ('Programming', 'Lorem ipsum'),
    ('Application of Subject Matter Comprehension', 'Lorem ipsum'),
    ('Planning', 'Establishes and prioritizes tasks and objectives in order to manage time and resources appropriately. Sets deadlines based on the time required for each task, and on how each part of their plan affects the others; has backup plans in case the situation changes'),
    ('VUCA (Volatility, Uncertainty, Complexity, Ambiguity)', 'Lorem ipsum'),
    ('Applied Operational Knowledge and Skills', 'Lorem ipsum'),
    ('Facilitating Interaction', 'Lorem ipsum'),
    ('Introspection', 'Lorem ipsum'),
    ('Social', 'Lorem ipsum'),
    ('Communcation', 'Lorem ipsum'),
    ('Team', 'Lorem ipsum');

INSERT INTO competencies (label, description, principal_id, category_id, subcategory_id) VALUES
    ('Data Structures', 'Knowing how to arrange data on a computer so that it can be accessed and updated efficiently', 1, 1, 6),
    ('Algorithms', 'Knowing about processes or sets of rules to be followed in calculations or other problem-solving operations', 1, 1, 6),
    ('Frameworks', 'Lorem ipsum', 1, 1, 7),
    ('Database', 'Lorem ipsum', 1, 1, 7),
    ('Debugging', 'Lorem ipsum', 1, 1, 8),
    ('Understanding Code', 'Lorem ipsum', 1, 1, 8)
    ('Estimation', 'Reliably predicting how long something will take', 1, 2, 9)
    ('Anticipation', 'Lorem ipsum', 1, 2, 9),
    ('Handling Change', 'Lorem ipsum', 1, 2, 10)
    ('Autonomy', 'Lorem ipsum', 1, 2, 10)
    ('Intuition', 'Lorem ipsum', 1, 2, 10)
    ('Quality Control', 'Lorem ipsum', 1, 3, 11)
    ('Probelm Solving', 'Lorem ipsum', 1, 3, 11)
    ('Documentation', 'Lorem ipsum', 1, 3, 11)
    ('Developing Others', 'Lorem ipsum', 1, 3, 12),
    ('Pair Programming', 'Lorem ipsum', 1, 3, 12),
    ('Self-Awareness', 'Lorem ipsum', 1, 4, 13),
    ('Agency', 'Lorem ipsum', 1, 4, 13),
    ('Honesty', 'Lorem ipsum', 1, 4, 13),
    ('Interpersonal Awareness', 'Lorem ipsum', 1, 4, 14),
    ('Caring Connection', 'Lorem ipsum', 1, 4, 14),
    ('Written Communcation', 'Lorem ipsum', 1, 5, 15),
    ('Client Focus', 'Lorem ipsum', 1, 5, 15),
    ('Providing Feedback', 'Lorem ipsum', 1, 5, 15),
    ('Collaboration', 'Lorem ipsum', 1, 5, 16),
    ('Mentorship', 'Lorem ipsum', 1, 5, 16),
    ('Diplomatic Sensitivity', 'Lorem ipsum', 1, 5, 16);