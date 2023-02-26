export interface AssessmentRow {
  id: number;
  title: string;
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
    title: 'Finalize the Product Specification',
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
    title: 'Intermediate Git + GitHub ',
    type: 'Assignment',
    dueDate: '2023-01-25',
    testDuration: 60,
    submittedDate: '-',
    score: 0,
    availableDate: '2023-01-15',
    status: 'Unsubmitted',
  },
];
