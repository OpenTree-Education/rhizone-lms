import { Router } from 'express';

import { BadRequestError, NotFoundError } from './httpErrors';
import { findQuestionnaire } from '../services/questionnairesService';
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

export default questionnairesRouter;
