import db from './db';

// export const getQuestion = async (principalId: number) => {
//   const [question] = await db('my_cool_feature').select(
//     'page_number'
//   ).where("principal_id", principalId);
//   return question;
// };

export const createQuestion = async (
  questionnaireId: number,
  question: string,
  answer: string,
  option1: string,
  option2: string,
  option3: string
) => {
  let questionId: number;
  await db.transaction(async trx => {
    [questionId] = await trx('questions').insert({
      question_text: question,
      answer: answer,
      options: option1 + ',' + option2 + ',' + option3,
      questionnaire_id: questionnaireId

    });
  });
  return questionId;
};


