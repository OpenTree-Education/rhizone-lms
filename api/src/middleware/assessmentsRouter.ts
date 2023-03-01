import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import {
  listAssessmentsByParticipant,
  createAssessment
} from '../services/assessmentService';
import { ValidationError } from './httpErrors';

const assessmentsRouter = Router();

// assessmentsRouter.get('/', async (req, res, next) => {
//   const { principalId } = req.session;
//   let assessments;
//   try {
//     assessments = await listAssessmentsByParticipant(principalId);
//   } catch (error) {
//     next(error);
//     return;
//   }
//   res.json(
//     collectionEnvelope(assessments, assessments.length)
//   );
// });

assessmentsRouter.get('/', async (req, res, next) => {
  let assessments;
  try {
    assessments = await listAssessmentsByParticipant();
  } catch (error) {
    next(error);
    return;
  }
  res.json(collectionEnvelope(assessments, assessments.length));
});


// createAssessment POST route ***
assessmentsRouter.post('/', async (req, res, next) => {
  // const response = { behaviour: 'Creates a new assessment' };
  const { title, description, maxScore, maxNumSubmissions, timeLimit} = req.body;
  const { principalId } = req.session;
  const {
    curriculum_id: curriculumId,
    activity_id: activityId,
  } = req.body;
  // const assessmentId = Number(id);
  // if (!Number.isInteger(assessmentId) || assessmentId < 1) {
  //   next(new BadRequestError(`"${id}" is not a valid meeting id.`));
  //  return;
  // }
  if (typeof title !== 'string') {
    next(new ValidationError('title must be a string!'));
    return;
  }
  if (typeof description !== 'string') {
    next(new ValidationError('description must be a string!'));
    return;
  }
  if (typeof maxScore !== 'number') {
    next(new ValidationError('maxScore must be a number!'))
  }
  if (typeof maxNumSubmissions !== 'number') {
    next(new ValidationError('maxNumSubmissions must be a number!'))
  }
  if (typeof timeLimit !== 'number') {
    next(new ValidationError('timeLimit must be a number!'))
  }
  let assessment;
  try {
    assessment = await createAssessment(title, description, maxScore, maxNumSubmissions, timeLimit, curriculumId, activityId, principalId);
    } catch (error) {
      next(error);
      return;
    }
  res.status(200).json(itemEnvelope(assessment));
});

assessmentsRouter.get('/:assessmentId', (req, res) => {
  const response = { behaviour: 'Shows a single assessment' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.put('/:assessmentId', (req, res) => {
  const response = { behaviour: 'Edits an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.delete('/:assessmentId', (req, res) => {
  const response = { behaviour: '“Deletes” an assessment in the system' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get('/:assessmentId/submissions/new', (req, res) => {
  const response = { behaviour: 'Creates a new draft submission' };
  res.status(200).json(itemEnvelope(response));
});

assessmentsRouter.get(
  '/:assessmentId/submissions/:submissionId',
  (req, res) => {
    const response = {
      behaviour: 'Returns the submission information (metadata, answers, etc)',
    };
    res.status(200).json(itemEnvelope(response));
  }
);

assessmentsRouter.put(
  '/:assessmentId/submissions/:submissionId',
  (req, res) => {
    const response = { behaviour: 'Updates the state of a submission' };
    res.status(200).json(itemEnvelope(response));
  }
);

export default assessmentsRouter;
