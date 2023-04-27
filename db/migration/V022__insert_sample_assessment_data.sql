INSERT INTO `activity_types`
  (`title`)
VALUES
  ("quiz"),
  ("test");

INSERT INTO `assessment_submission_states`
  (`title`)
VALUES
  ("Inactive"),
  ("Active"),
  ("Opened"),
  ("In Progress"),
  ("Expired"),
  ("Submitted"),
  ("Graded"),
  ("Hidden");

INSERT INTO `program_participant_roles`
  (`title`)
VALUES
  ("Facilitator"),
  ("Participant");

INSERT INTO `curriculums`
  (`title`, `principal_id`)
VALUES
  ("Beginner Web Development", 2);

INSERT INTO `programs`
  (`title`, `start_date`, `end_date`, `time_zone`, `principal_id`, `curriculum_id`)
VALUES
  ("Cohort 5", "2023-02-06", "2023-03-31", "America/Vancouver", 2, 3);

INSERT INTO `activities`
  (`title`, `description_text`, `curriculum_week`, `curriculum_day`, `start_time`, `end_time`, `duration`, `activity_type_id`, `curriculum_id`)
VALUES
  ("Assignment 1: React", "Your assignment for week 1 learning.", 1, 5, NULL, NULL, NULL, 1, 3),
  ("SQL Quiz", "A check on your SQL learning.", 7, 5, NULL, NULL, NULL, 10, 3),
  ("Final Exam", "The final exam for the course.", 8, 5, NULL, NULL, NULL, 11, 3);

INSERT INTO `assessment_question_types`
  (`title`)
VALUES
  ("single choice"),
  ("free response");

INSERT INTO `curriculum_assessments`
  (`title`, `description`, `max_score`, `max_num_submissions`, `time_limit`, `curriculum_id`, `activity_id`, `principal_id`)
VALUES
  ("Assignment 1: React", "Your assignment for week 1 learning.", 10, 1, NULL, 3, 97, 2),
  ("SQL Quiz", "A check on your SQL learning.", 5, 3, NULL, 3, 98, 2),
  ("Final Exam", "The final exam for the course.", 50, 1, 120, 3, 99, 2);

INSERT INTO `program_assessments`
  (`program_id`, `assessment_id`, `available_after`, `due_date`)
VALUES
  (2, 1, "2023-02-06", "2023-06-10"),
  (2, 2, "2023-02-06", "2023-06-24"),
  (2, 3, "2023-02-20", "2023-06-30");

INSERT INTO `assessment_questions`
  (`assessment_id`, `title`, `description`, `question_type_id`, `correct_answer_id`, `max_score`, `sort_order`)
VALUES
  (1, "What is React?", NULL, 1, 4, 1, 1),
  (1, "What is the purpose of JSX in React?", NULL, 1, 5, 1, 2),
  (1, "What is the virtual DOM in React?", NULL, 1, 9, 1, 3),
  (1, "What are React components?", NULL, 1, 14, 1, 4),
  (1, "When lifting state up, you need to move the useState from a child component to a parent component.", NULL, 1, 18, 1, 5),
  (1, "Which of the following options describe what a prop is in React", NULL, 1, 21, 1, 6),
  (1, "If the state variable holds an array or a string value, once you pass that state via props from a parent to a child, you can then read the length property from the received prop in the child component", NULL, 1, 23, 1, 7),
  (1, "Write a React JSX component that displays the text “Hello, World!” on the screen.", NULL, 2, NULL, 1, 8),
  (1, "How does React differ from other JavaScript frameworks?", NULL, 2, NULL, 1, 9),
  (1, "What are some of the benefits of using React?", NULL, 2, NULL, 1, 10),
  (2, "A JOIN clause is used to combine rows from two or more tables, based on a related column between them. Which command is not a JOIN type in SQL?", NULL, 1, 30, 1, 1),
  (2, "Which statement is wrong?", NULL, 1, 32, 2, 2),
  (2, "How can we add a column to a table?", NULL, 1, 39, 1, 3),
  (2, "Each table can contain more than one primary key.", NULL, 1, 41, 1, 4),
  (3, "What is MySQL?", NULL, 1, 42, 1, 1),
  (3, "INT and VARCHAR are some common data types in MySQL.", NULL, 1, 46, 1, 2),
  (3, "Which command is used to create a new database in MySQL?", NULL, 1, 50, 1, 3),
  (3, "COUNT, SUM, and INSERT INTO are some common MySQL aggregate functions.", NULL, 1, 53, 1, 4),
  (3, "Which command is used to insert new data into a MySQL table?", NULL, 1, 57, 1, 5),
  (3, "Which command is used to delete a table from a MySQL database?", NULL, 1, 59, 1, 6),
  (3, "Which builtin MySQL function can be used to add every value from a column together in a query?", NULL, 1, 65, 1, 7),
  (3, "Which command is used to retrieve data from a MySQL table?", NULL, 2, NULL, 9, 8),
  (3, "Which function is used to count the number of rows in a MySQL table?", NULL, 2, NULL, 9, 9),
  (3, "Which keyword is used to specify the condition for a MySQL query?", NULL, 2, NULL, 10, 10);

INSERT INTO `assessment_answers`
  (`question_id`, `title`, `description`, `sort_order`)
VALUES
  (1, "A relational database management system", NULL, 1),
  (1, "A database management system", NULL, 2),
  (1, "A web server software", NULL, 3),
  (1, "A front-end JavaScript library", NULL, 4),
  (2, "To provide a syntax for writing HTML in JavaScript", NULL, 1),
  (2, "To provide a syntax for writing JavaScript in HTML", NULL, 2),
  (2, "To provide a syntax for writing SQL in JavaScript", NULL, 3),
  (2, "To provide a syntax for writing CSS in JavaScript", NULL, 4),
  (3, "A virtual representation of the actual HTML DOM", NULL, 1),
  (3, "A physical representation of the actual HTML DOM", NULL, 2),
  (3, "A database of all the components in a React application", NULL, 3),
  (3, "A list of all the CSS styles used in a React application", NULL, 4),
  (4, "An object-oriented programming language feature", NULL, 1),
  (4, "Reusable pieces of UI", NULL, 2),
  (4, "A way to define styles in React", NULL, 3),
  (4, "A way to define database schemas in React", NULL, 4),
  (5, "True", NULL, 1),
  (5, "False", NULL, 2),
  (6, "A built-in method for creating React components", NULL, 1),
  (6, "A type of HTML tag used to define a custom element", NULL, 2),
  (6, "A data object passed from a parent component to a child component", NULL, 3),
  (6, "A tool that helps optimize the performance of a React app", NULL, 4),
  (7, "True", NULL, 1),
  (7, "False", NULL, 2),
  (8, "const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;", NULL, 1),
  (9, "React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.", NULL, 1),
  (10, "Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.", NULL, 1),
  (11, "Self Join", NULL, 1),
  (11, "Full Join", NULL, 2),
  (11, "Half Join", NULL, 3),
  (11, "Inner Join", NULL, 4),
  (12, "TypeScript is known as a dynamically-typed language", NULL, 1),
  (12, "JavaScript is both a functional as well as object-oriented programming language", NULL, 2),
  (12, "TypeScript takes a long time to compile the code", NULL, 3),
  (12, "During compile time, the source code is translated to a byte code", NULL, 4),
  (13, "CREATE TABLE", NULL, 1),
  (13, "ADD DATA", NULL, 2),
  (13, "INSERT DATA", NULL, 3),
  (13, "ALTER TABLE", NULL, 4),
  (14, "True", NULL, 1),
  (14, "False", NULL, 2),
  (15, "A relational database management system", NULL, 1),
  (15, "A programming language", NULL, 2),
  (15, "An operating system", NULL, 3),
  (15, "A web server", NULL, 4),
  (16, "True", NULL, 1),
  (16, "False", NULL, 2),
  (17, "CREATE TABLE", NULL, 1),
  (17, "CREATE INDEX", NULL, 2),
  (17, "CREATE DATABASE", NULL, 3),
  (17, "CREATE SCHEMA", NULL, 4),
  (18, "True", NULL, 1),
  (18, "False", NULL, 2),
  (19, "ADD DATA", NULL, 1),
  (19, "INSERT DATA", NULL, 2),
  (19, "INSERT ROW", NULL, 3),
  (19, "INSERT INTO", NULL, 4),
  (20, "DELETE TABLE", NULL, 1),
  (20, "DROP TABLE", NULL, 2),
  (20, "REMOVE TABLE", NULL, 3),
  (20, "ERASE TABLE", NULL, 4),
  (21, "MAX", NULL, 1),
  (21, "TOGETHER", NULL, 2),
  (21, "TOTAL", NULL, 3),
  (21, "SUM", NULL, 4),
  (21, "MIN", NULL, 5),
  (21, "SUMTOTAL", NULL, 6),
  (21, "TOTALSUM", NULL, 7),
  (22, "The SELECT command is used to retrieve data from a MySQL table.", NULL, 1),
  (23, "COUNT()", NULL, 1),
  (24, "WHERE", NULL, 1);
