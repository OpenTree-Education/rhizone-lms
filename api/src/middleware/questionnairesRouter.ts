import { Router } from 'express';

import { BadRequestError, NotFoundError } from './httpErrors';
import { findQuestionnaire, findQuestionnaires, createQuestionnaire } from '../services/questionnairesService';
import { createQuestion } from "../services/questionsService";
import { itemEnvelope } from './responseEnvelope';

const questionnairesRouter = Router();

questionnairesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  const questionnaireId = Number(id);
  if (!Number.isInteger(questionnaireId) || questionnaireId < 1) {
    next(new BadRequestError(`"${id}" is not a valid questionnaire id.`));
    return;
  }
  let questionnaire;
  try {
    questionnaire = await findQuestionnaire(questionnaireId);
  } catch (err) {
    next(err);
    return;
  }
  if (!questionnaire) {
    next(
      new NotFoundError(
        `A questionnaire with the id "${id}" could not be found.`
      )
    );
    return;
  }
  res.json(itemEnvelope(questionnaire));
});



questionnairesRouter.post('/',  async (req, res, next) => {
  const { principalId } = req.session;
  const { questions, title, answers, options } = req.body;

  let questionnaireId = -1;
  let questionId = -1;
  try {
    questionnaireId = await createQuestionnaire(principalId, title);

    for (let i = 0; i < questions.length && i < answers.length; i++) {
      questionId = await  createQuestion(questionnaireId, questions[i], answers[i], options[i], options[i+1], options[i+1])
      i - 2;
    }

  } catch (e) {
    next(e);
    return;
  }

  res.status(200).json(itemEnvelope({id: questionnaireId}));
});




questionnairesRouter.get('/', async (req, res, next) => {
  let questionnaires;
  try {
    questionnaires = await findQuestionnaires();
  } catch (err) {
    next(err);
    return;
  }

  if (!questionnaires) {
    next(
      new NotFoundError(
        `List of questionnaires could not be found.`
      )
    );
    return;
  }
  res.json(itemEnvelope(questionnaires));
});

export default questionnairesRouter;
