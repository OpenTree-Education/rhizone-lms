export interface AssessmentRow {
  id: number;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  testDuration: number;
  submittedDate: string;
  score: number;
  availableDate: string;
  status: string;
}

export const assessmentList: AssessmentRow[] = [
  {
    id: 1,
    title: 'Debugging and Testing',
    description: 'Debugging in Visual Studio and Unit Test',
    type: 'Assignment',
    dueDate: '2023-03-25',
    testDuration: 0,
    submittedDate: '-',
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
    submittedDate: '-',
    score: -1,
    availableDate: '2023-04-11',
    status: 'Active',
  },
  {
    id: 3,
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
    id: 4,
    title: 'Product-Minded Professional',
    description:
      'Develop and techniques to grow-up proficiency. Books Product-Minded Professional',
    type: 'Assignment',
    dueDate: '2023-05-23',
    testDuration: 0,
    submittedDate: '-',
    score: 0,
    availableDate: '2023-01-11',
    status: 'Unsubmitted',
  },
  {
    id: 5,
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
    id: 6,
    title: 'Leadership and Teamwork',
    description: 'Unit 1 and 2 book: "Modern Leadership". Teamwork in GitHub',
    type: 'Assignment',
    dueDate: '2023-03-27',
    testDuration: 0,
    submittedDate: '-',
    score: -1,
    availableDate: '2023-02-27',
    status: 'Upcoming',
  },
  {
    id: 7,
    title: 'Git + GitHub ',
    description:
      'Concepts, commands and relation between Git + GitHub and practices exercises',
    type: 'Assignment',
    dueDate: '2023-01-25',
    testDuration: 60,
    submittedDate: '-',
    score: 0,
    availableDate: '2023-01-15',
    status: 'Unsubmitted',
  },
];
