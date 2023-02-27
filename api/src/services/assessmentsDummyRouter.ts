import db from './db';

export const setAssessmentSubmissions = async () => {
  await db('assessment_submissions').insert({});

  return {};
};
