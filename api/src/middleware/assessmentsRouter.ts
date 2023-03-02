import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import { BadRequestError } from './httpErrors';
import { ValidationError } from './httpErrors';
// import {listAssessmentsByParticipant} from '../services/assessmentService'
<<<<<<< HEAD
import { listAssessmentsByParticipant, createAssessment, assessmentById, updateAssessmentById, deleteAssessmentById } from '../services/assessmentService';

const assessmentsRouter = Router();


=======
import { listAssessmentsByParticipant, createAssessment, assessmentById, deleteAssessmentById } from '../services/assessmentService';

const assessmentsRouter = Router();

>>>>>>> 61ca0682ff0a204ef9ece92a981107d4173a931f
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
const {principalId} = req.session;
const principalIdNum = Number(principalId)
  let assessments;
  try {
    assessments = await listAssessmentsByParticipant(principalIdNum);
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(assessments, assessments.length)
  );
});
// createAssessment POST route ***
assessmentsRouter.post('/', async (req, res, next) => {
  // const response = { behaviour: 'Creates a new assessment' };
  const { title, description, max_score: maxScore, max_num_submissions: maxNumSubmissions, time_limit: timeLimit } =
    req.body;
  const { principalId } = req.session;
  const { curriculum_id: curriculumId, activity_id: activityId } = req.body;
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


assessmentsRouter.delete('/:assessmentId', async(req, res, next) => {
  const { assessmentId } = req.params;
  const assessmentIdNum = Number(assessmentId);

  if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
    next(new BadRequestError(`"${assessmentIdNum}" is not a valid assessment id.`));
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
<<<<<<< HEAD


=======
>>>>>>> 61ca0682ff0a204ef9ece92a981107d4173a931f

// assessmentsRouter.get('/:assessmentId', (req, res) => {
  //   const response = { behaviour: 'Shows a single assessment' };
//   res.status(200).json(itemEnvelope(response));
// });

assessmentsRouter.get('/:assessmentId', async (req, res, next) => {
  
   const { assessmentId } = req.params;
   const assessmentIdNum = Number(assessmentId);

  if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
    next(new BadRequestError(`"${assessmentIdNum}" is not a valid assessment id.`));
    return;
  }
  let neededAssessmentId;
  try {
    neededAssessmentId = await assessmentById(assessmentIdNum);
  } catch (error) {
    next(error);
    return;
  }
  res.json(
    collectionEnvelope(neededAssessmentId, neededAssessmentId.length)
  );
});



// assessmentsRouter.put('/assessment/:id', async (req, res, next) => {
//   const { assessmentId } = req.params;
//   const assessmentIdNum = Number(assessmentId);
//   const {principalId} = req.session;
//   const principalIdNum = Number(principalId)
//   const {
//     title,
//     description,
//     maxScore,
//     maxNumSubmissions,
//     timeLimit,
//     principalIdNum,
//   } = req.body;
//   if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
//     next(new BadRequestError(`"${assessmentIdNum}" is not a valid assessment id.`));
//     return;
//   }
//   if (!Number.isInteger(principalIdNum === 1)) {
//     next(new BadRequestError(`"${principalIdNum}" is not a valid id for updating.`));
//     return;
//   }
//   if (typeof title !== 'string') {
//     next(new ValidationError('title must be a string!'));
//     return;
//   }
//   if (typeof description !== 'string') {
//     next(new ValidationError('description must be a string!'));
//     return;
//   }
//   if (typeof maxScore !== 'number') {
//     next(new ValidationError('maxScore must be a number!'));
//   }
//   if (typeof maxNumSubmissions !== 'number') {
//     next(new ValidationError('maxNumSubmissions must be a number!'));
//   }
//   if (typeof timeLimit !== 'number') {
//     next(new ValidationError('timeLimit must be a number!'));
//   }
//   try { await updateAssessmentById(
//       title,
//       description,
//       maxScore,
//       maxNumSubmissions,
//       timeLimit,
//     );
//   } catch (error) {
//     next(error);
//     return;
//   }
//   res.json(itemEnvelope({ id: assessmentId }));
// });


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
