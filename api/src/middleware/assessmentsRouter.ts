import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
<<<<<<< HEAD
// import {listAssessmentsByParticipant} from '../services/assessmentService'
import {listAssessments, assessmentById} from '../services/assessmentService'
import { BadRequestError } from './httpErrors';
=======
import { listAssessmentsByParticipant } from '../services/assessmentService';

>>>>>>> f05768b3f7efd15d76b83c1498a7f461da5098bd
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
    assessments = await listAssessments();
  } catch (error) {
    next(error);
    return;
  }
  res.json(collectionEnvelope(assessments, assessments.length));
});

assessmentsRouter.post('/', (req, res) => {
  const response = { behaviour: 'Creates a new assessment' };
  res.status(200).json(itemEnvelope(response));
});

// assessmentsRouter.post('/', async (req, res, next) => {
//   const { principalId } = req.session;
//   const { raw_text: rawText, selected_option_ids: selectedOptionIds } =
//     req.body;
//   const optionIds = Array.isArray(selectedOptionIds) ? selectedOptionIds : [];
//   if (!rawText && !optionIds.length) {
//     next(
//       new BadRequestError(
//         'At least one option id or journal entry text must be given to create a reflection.'
//       )
//     );
//     return;
//   }
//   if (optionIds.some(optionId => !Number.isInteger(optionId) || optionId < 1)) {
//     next(
//       new ValidationError(
//         `selected_option_ids must be an array of positive integers.`
//       )
//     );
//     return;
//   }
//   let reflection;
//   try {
//     reflection = await createReflection(rawText, optionIds, principalId);
//   } catch (error) {
//     next(error);
//     return;
//   }
//   res.status(201).json(itemEnvelope(reflection));
// });

<<<<<<< HEAD


// assessmentsRouter.get('/:assessmentId', (req, res) => {
//   const response = { behaviour: 'Shows a single assessment' };
//   res.status(200).json(itemEnvelope(response));
// });

assessmentsRouter.get('/:assessmentId', async (req, res, next) => {
   const { assessmentId } = req.params;
   const assessmentIdNum = Number(assessmentId);

  if (!Number.isInteger(assessmentIdNum) || assessmentIdNum < 1) {
    next(new BadRequestError(`"${assessmentIdNum}" is not a valid program id.`));
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
=======
assessmentsRouter.get('/:assessmentId', (req, res) => {
  const response = { behaviour: 'Shows a single assessment' };
  res.status(200).json(itemEnvelope(response));
>>>>>>> f05768b3f7efd15d76b83c1498a7f461da5098bd
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
