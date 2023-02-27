export interface AssessmentRow {
  id: number;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  testDuration: number;
  submittedDate?: string;
  score: number;
  availableDate: string;
  status: string;
  maxNumSubmissions?: 1,
  question?: Question[],
}

interface Question{
  id: number;
  title: string;
  description?: string;
  questionType: string;
  correctAnswer?: number;
  maxScore: number;
  sortOrder: number;
  answers?: Answer[];
}

interface Answer{
  id?: number;
  title: string;
  description?: string;
  sortOrder: number;
}

export const assessmentList: AssessmentRow[] = [
  {
    id: 1,
    title: 'Debugging and Testing',
    description: 'Debugging in Visual Studio and Unit Test',
    type: 'Assignment',
    dueDate: '2023-03-25',
    testDuration: 0,
    score: -1,
    availableDate: '2023-02-25',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Communication and Documentation',
    description:
      'Git and GitHub. Informal and formal documentation JSDoc, JavaDoc, PyDoc, PerlDoc ',
    type: 'Test',
    dueDate: '2023-03-24',
    testDuration: 60,
    score: -1,
    availableDate: '2023-04-11',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Final Exam',
    description:
      'The final exam for the course.',
    type: 'Test',
    dueDate: '2023-03-31',
    testDuration: 120,
    score: 50,
    availableDate: '2023-03-20',
    status: 'Active',
    maxNumSubmissions: 1,
    question: [
      {
        id: 15,
        title: "What is MySQL?",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 1,
        answers:[
          {title: "A relational database management system", sortOrder: 1},
          {title: "A programming language", sortOrder: 2},
          {title: "An operating system", sortOrder: 3},
          {title: "A web server", sortOrder: 4},
        ]
      },
      {
        id: 16,
        title: "INT and VARCHAR are some common data types in MySQL.",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 2,
        answers: [
          {title: "True", sortOrder: 1},
          {title: "False", sortOrder: 2},
        ]
      },
      {    
        id: 17,
        title: "Which command is used to create a new database in MySQL?",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 3,
        answers: [
          {title: "CREATE TABLE", sortOrder: 1},
          {title: "CREATE INDEX", sortOrder: 2},
          {title: "CREATE DATABASE", sortOrder: 3},
          {title: "CREATE SCHEMA", sortOrder: 4},
        ]
      },
      {    
        id: 18,
        title: "COUNT, SUM, and INSERT INTO are some common MySQL aggregate functions.",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 4,
        answers: [
          {title: "True", sortOrder: 1},
          {title: "False", sortOrder: 2},
        ]
      },
      {    
        id: 19,
        title: "Which command is used to insert new data into a MySQL table?",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 5,
        answers: [
          {title: "ADD DATA", sortOrder: 1},
          {title: "INSERT DATA", sortOrder: 2},
          {title: "INSERT ROW", sortOrder: 3},
          {title: "INSERT INTO", sortOrder: 4},
        ]
      },
      {    
        id: 20,
        title: "Which command is used to delete a table from a MySQL database?",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 6,
        answers: [
          {title: "DELETE TABLE", sortOrder: 1},
          {title: "DROP TABLE", sortOrder: 2},
          {title: "REMOVE TABLE", sortOrder: 3},
          {title: "ERASE TABLE", sortOrder: 4},
        ]
      },
      {    
        id: 21,
        title: "Which builtin MySQL function can be used to add every value from a column together in a query?",
        questionType: "single choice",
        maxScore: 1,
        sortOrder: 7,
        answers: [
          {title: "MAX", sortOrder: 1},
          {title: "TOGETHER", sortOrder: 2},
          {title: "TOTAL", sortOrder: 3},
          {title: "SUM", sortOrder: 4},
          {title: "MIN", sortOrder: 5},
          {title: "SUMTOTAL", sortOrder: 6},
          {title: "TOTALSUM", sortOrder: 7},
        ]
      },
      {    
        id: 22,
        title: "Which command is used to retrieve data from a MySQL table?",
        questionType: "free response",
        maxScore: 9,
        sortOrder: 8,
      },
      {    
        id: 23,
        title: "Which function is used to count the number of rows in a MySQL table?",
        questionType: "free response",
        maxScore: 9,
        sortOrder: 9,
      },
      {    
        id: 24,
        title: "Which keyword is used to specify the condition for a MySQL query?",
        questionType: "free response",
        maxScore: 10,
        sortOrder: 10,
      }
    ]
  },
  {
    id: 4,
    title: 'Accessibility in Design',
    description:
      'Differents standars and Method related to averyone can access to webpages',
    type: 'Practice Quiz',
    dueDate: '2023-06-22',
    testDuration: 0,
    submittedDate: '2023-02-22',
    score: 90,
    availableDate: '2023-01-22',
    status: 'Graded',
  },
  {
    id: 5,
    title: 'Product-Minded Professional',
    description:
      'Develop and techniques to grow-up proficiency. Books Product-Minded Professional',
    type: 'Assignment',
    dueDate: '2023-05-23',
    testDuration: 0,
    score: 0,
    availableDate: '2023-01-11',
    status: 'Unsubmitted',
  },
  {
    id: 6,
    title: 'Evaluation Product Specification',
    description:
      'Steps to get a product specification, vocabulary and who are involved',
    type: 'Test',
    dueDate: '2023-01-11',
    testDuration: 60,
    submittedDate: '2023-02-22',
    score: -1,
    availableDate: '2023-09-08',
    status: 'Submitted',
  },
  {
    id: 7,
    title: 'Leadership and Teamwork',
    description: 'Unit 1 and 2 book: "Modern Leadership". Teamwork in GitHub',
    type: 'Assignment',
    dueDate: '2023-03-27',
    testDuration: 0,
    score: -1,
    availableDate: '2023-02-27',
    status: 'Upcoming',
  },
  {
    id: 8,
    title: 'Git + GitHub ',
    description:
      'Concepts, commands and relation between Git + GitHub and practices exercises',
    type: 'Assignment',
    dueDate: '2023-01-25',
    testDuration: 60,
    score: 0,
    availableDate: '2023-01-15',
    status: 'Unsubmitted',
  },
];
