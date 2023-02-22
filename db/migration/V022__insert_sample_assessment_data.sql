INSERT INTO `activity_types` (`title`)
VALUES (`quiz`),
    (`test`);
INSERT INTO `curriculums` (`title`, `principal_id`)
VALUES ("Beginner Web Development", 2);
INSERT INTO `programs` (
        `title`,
        `start_date`,
        `end_date`,
        `time_zone`,
        `principal_id`,
        `curriculum_id`
    )
VALUES (
        "Spring 2023",
        "2023-02-06",
        "2023-03-31",
        "America/Vancouver",
        2,
        3
    );
INSERT INTO `activities` (
        `title`,
        `description_text`,
        `curriculum_week`,
        `curriculum_day`,
        `start_time`,
        `end_time`,
        `duration`,
        `activity_type_id`,
        `curriculum_id`
    )
VALUES (
        "Assignment 1: React",
        "Your assignment for week 1 learning.",
        1,
        5,
        NULL,
        NULL,
        NULL,
        1,
        3
    ),
    (
        "Quiz 1: SQL",
        "A check on your SQL learning.",
        2,
        5,
        NULL,
        NULL,
        NULL,
        10,
        3
    ),
    (
        "Test 1: SQL",
        "A check on your SQL learning -- for credit!",
        3,
        1,
        NULL,
        NULL,
        NULL,
        11,
        3
    );
INSERT INTO `question_types` (`title`)
VALUES ("multiple choice"),
    ("free response");
-- TODO: Insert the quiz and test. --
INSERT INTO `curriculum_assessments` (
        `title`,
        `description`,
        `max_score`,
        `max_num_submissions`,
        `time_limit`,
        `curriculum_id`,
        `activity_id`,
        `principal_id`
    )
VALUES (
        "Assignment 1: React",
        "Your assignment for week 1 learning.",
        10,
        1,
        NULL,
        3,
        97,
        2
    );
-- TODO: Figure out what to insert here. --
INSERT INTO `program_assessments`;
-- TODO: Insert the other questions. --
INSERT INTO `assessment_questions` (
        `assessment_id`,
        `title`,
        `description`,
        `question_type_id`,
        `correct_answer_id`,
        `max_score`,
        `sort_order`
    )
VALUES (1, "What is React?", NULL, 1, 4, 1, 1),
    (
        1,
        "What is the purpose of JSX in React?",
        NULL,
        1,
        5,
        1,
        2
    );
-- TODO: Insert the other answers. --
INSERT INTO `assessment_answers` (
        `question_id`,
        `title`,
        `description`,
        `sort_order`
    )
VALUES (1, "A back-end programming language", NULL, 1),
    (1, "A database management system", NULL, 2),
    (1, "A web server software", NULL, 3),
    (1, "A front-end JavaScript library", NULL, 4),
    (
        2,
        "To provide a syntax for writing HTML in JavaScript",
        NULL,
        1
    ),
    (
        2,
        "To provide a syntax for writing JavaScript in HTML",
        NULL,
        2
    ),
    (
        2,
        "To provide a syntax for writing SQL in JavaScript",
        NULL,
        3
    ),
    (
        2,
        "To provide a syntax for writing CSS in JavaScript",
        NULL,
        4
    );