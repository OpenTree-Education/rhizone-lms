import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import { BadRequestError, NotFoundError, ValidationError } from './httpErrors';
import {
  listAssessmentsByParticipant,
  createAssessment,
  assessmentById,
  updateAssessmentById,
  deleteAssessmentById,
  findRoleParticipant,
} from '../services/assessmentService';

const assessmentsRouter = Router();

// Shows a list of all assessments
assessmentsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  const principalIdNum = Number(principalId);
  let assessments;
  try {
    assessments = await listAssessmentsByParticipant(principalIdNum);
  } catch (error) {
    next(error);
    return;
  }
  res.json(collectionEnvelope(assessments, assessments.length));
});

// Creates a new assessment
assessmentsRouter.post('/', async (req, res, next) => {
  const {
    title,
    description,
    max_score: maxScore,
    max_num_submissions: maxNumSubmissions,
    time_limit: timeLimit,
  } = req.body;
  const { principalId } = req.session;
  const { curriculum_id: curriculumId, activity_id: activityId } = req.body;

  // if (!Number.isInteger(principalId === 1)) {
  //   next(new BadRequestError(`"You are not able to create new assessment`));
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
    next(new ValidationError('maxScore must be a number!'));
  }
  if (typeof maxNumSubmissions !== 'number') {
    next(new ValidationError('maxNumSubmissions must be a number!'));
  }
  if (typeof timeLimit !== 'number') {
    next(new ValidationError('timeLimit must be a number!'));
  }
  let assessment;
  try {
    assessment = await createAssessment(
      title,
      description,
      maxScore,
      maxNumSubmissions,
      timeLimit,
      curriculumId,
      activityId,
      principalId
    );
  } catch (error) {
    next(error);
    return;
  }
  res.status(200).json(itemEnvelope(assessment));
});

// Deletes” an assessment in the system
assessmentsRouter.delete('/:assessmentId', async (req, res, next) => {
  const { assessmentId } = req.params;
  const assessmentIdNum = Number(assessmentId);

  if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
    next(
      new BadRequestError(`"${assessmentIdNum}" is not a valid assessment id.`)
    );
    return;
  }
  try {
    await deleteAssessmentById(assessmentIdNum);
  } catch (error) {
    next(error);
    return;
  }
  res.status(204).send();
});

//Shows a single assessment
assessmentsRouter.get('/:assessmentId', async (req, res, next) => {
  const { assessmentId } = req.params;
  const assessmentIdNum = Number(assessmentId);

  if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
    next(
      new BadRequestError(`"${assessmentIdNum}" is not a valid assessment id.`)
    );
    return;
  }
  let neededAssessmentId;
  try {
    neededAssessmentId = await assessmentById(assessmentIdNum);
  } catch (error) {
    next(error);
    return;
  }
  res.json(collectionEnvelope(neededAssessmentId, neededAssessmentId.length));
});

//Edits an assessment in the system

assessmentsRouter.put('/assessment/:id', async (req, res, next) => {
  const { id } = req.params;
  const assessmentId = Number(id);
  // const programId = req.params;
  // const progranIdNum = Number(programId);
  const { principalId } = req.session;
  const principalIdNum = Number(principalId);

  if (!Number.isInteger(assessmentId) || assessmentId < 1) {
    next(new BadRequestError(`"${id}" is not a valid assessment id.`));
    return;
  }
  let isAuthorized;
  try {
    // isAuthorized = await findRoleParticipant(principalId, progranIdNum);
  } catch (error) {
    next(error);
    return;
  }
  if (!isAuthorized) {
    next(
      new NotFoundError(
        `A competency with the id "${assessmentId}" could not be found.`
      )
    );
    return;
  }
  const {
    title,
    description,
    maxScore,
    maxNumSubmissions,
    timeLimit,
    curiculumId,
    activityId,
    questions,
    availableAfter,
    dueDate,
    programAssessmentId,
    programId,
  } = req.body;

  if (typeof title !== 'string') {
    next(new ValidationError('title must be a string!'));
    return;
  }
  if (typeof description !== 'string') {
    next(new ValidationError('description must be a string!'));
    return;
  }
  if (typeof maxScore !== 'number') {
    next(new ValidationError('maxScore must be a number!'));
  }
  if (typeof maxNumSubmissions !== 'number') {
    next(new ValidationError('maxNumSubmissions must be a number!'));
  }
  if (typeof timeLimit !== 'number') {
    next(new ValidationError('timeLimit must be a number!'));
  }
  if (typeof availableAfter !== 'string') {
    next(new ValidationError('availableAfter must be a string!'));
  }
  if (typeof dueDate !== 'string') {
    next(new ValidationError('dueDate must be a string!'));
  }
  try {
    await updateAssessmentById(
      title,
      description,
      maxScore,
      maxNumSubmissions,
      timeLimit,
      curiculumId,
      principalId,
      activityId,
      questions,
      availableAfter,
      dueDate,
      programAssessmentId,
      programId,
      assessmentId
    );
  } catch (error) {
    next(error);
    return;
  }
  res.json(itemEnvelope({ id: id }));
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
