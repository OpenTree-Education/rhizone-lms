import { Router } from 'express';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';
import { BadRequestError, ValidationError } from './httpErrors';
import {
  createAssessment,
  updateAssessmentById,
  deleteAssessmentById,
  getProgramIdByProgramAssessmentId,
  findRoleInProgram,
  programAssessmentById,
  submissionDetails,
  getCurriculumAssessmentById
  
} from '../services/assessmentService';
import { AssessmentWithSummary,Assessment, SavedAssessment,AssessmentSubmission } from '../models';

const assessmentsRouter = Router();

// Incoming: nothing expected
// Outgoing:
// - participant: CurriculumAssessment (not including 'questions' member), ProgramAssessment, and AssessmentSubmissionsSummary for their submissions to this program assessment
// - facilitator: CurriculumAssessment (not including 'questions' member), ProgramAssessment, and AssessmentSubmissionsSummary for all submissions to this program assessment
assessmentsRouter.get('/', async (req, res, next) => {
  // const { principalId } = req.session;

  let assessments: AssessmentWithSummary[];
  try {
    // assessments = await getAssessmentsSummary(principalId);
  } catch (error) {
    next(error);
    return;
  }

  res.json(collectionEnvelope(assessments, assessments.length));
});

// TODO: fixed function
// assessmentsRouter.get('/:assessmentId', async (req, res, next) => {
//   const { assessmentId } = req.params;
//   const assessmentIdNum = Number(assessmentId);
//   try {
//     const [assessmentsForFacilitator, assessmentsForParticipant] =
//       await Promise.all([
//         getCurriculumAssessmentById(assessmentIdNum, true, true),
//         getCurriculumAssessmentById(assessmentIdNum, true, false),
//       ]);
//     res.json({
//       facilitatorAssessment: collectionEnvelope(
//         assessmentsForFacilitator,
//         assessmentsForFacilitator.length
//       ),
//       participantAssessment: collectionEnvelope(
//         assessmentsForParticipant,
//         assessmentsForParticipant.length
//       ),
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// Creates a new assessment
// Incoming: CurriculumAssessment (including 'questions') and ProgramAssessment
// Outgoing: ids of rows inserted into both curriculum_assessments and program_assessments tables
assessmentsRouter.post('/', async (req, res, next) => {
  const {
    title,
    description,
    max_score: maxScore,
    max_num_submissions: maxNumSubmissions,
    time_limit: timeLimit,
    available_after: availableAfter,
    due_date: dueDate,
    program_id: programId,
  } = req.body;
  const { principalId } = req.session;
  const { curriculum_id: curriculumId, activity_id: activityId } = req.body;

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
  if (typeof curriculumId !== 'number') {
    next(new ValidationError('curriculumId must be a number!'));
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
      principalId,
      availableAfter,
      programId,
      dueDate
    );
  } catch (error) {
    next(error);
    return;
  }
  res.status(200).json(itemEnvelope(assessment));
});

//Shows a single assessment

// Outgoing:
// - participant: CurriculumAssessment (not including 'questions' member), ProgramAssessment, and their AssessmentSubmissions[] (not including 'responses' member)
// - facilitator: CurriculumAssessment (including 'questions' and 'answers'), ProgramAssessment, and all AssessmentSubmissions[] for all assessment submissions for this assessment and for participants in this program (not including 'responses' member)
// TODO: fixed function

// assessmentsRouter.get('/:assessmentId', async (req, res, next) => {
//   const { assessmentId } = req.params;
//   const assessmentIdNum = Number(assessmentId);
//   let assessmentsResponse;
//   try {
//     assessmentsResponse = await getCurriculumAssessmentById(
//       assessmentIdNum,
//       true,
//       true
//     );
//   } catch (error) {
//     next(error);
//     return;
//   }
//   res.json(collectionEnvelope(assessmentsResponse, assessmentsResponse.length));
// });

// Edits an assessment in the system

// Incoming: CurriculumAssessment (including 'questions') and ProgramAssessment
// Outgoing: ids of rows inserted into both curriculum_assessments and program_assessments tables
assessmentsRouter.put('/assessment/:assessmentId', async (req, res, next) => {
  const { assessmentId } = req.params;
  const assessmentIdNumber = Number(assessmentId);
  const { principalId } = req.session;
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
    programId,
  } = req.body;

  // waiting to figure out how to refactor this into the function outside
  if (!Number.isInteger(assessmentIdNumber) || assessmentIdNumber < 1) {
    next(
      new BadRequestError(`"${assessmentId}" is not a valid assessment id.`)
    );
    return;
  }

  // autorizedCheck(principalId, programId, assessmentIdNumber, next);

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
      programId,
      assessmentIdNumber
    );
  } catch (error) {
    next(error);
    return;
  }
  res.json(itemEnvelope({ id: assessmentId }));
});

//TODO: logic should be changed to facilitator/participant role based on permission
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
//TODO: fixed the router
// Outgoing:
// - participants: CurriculumAssessment (with 'questions' and 'answers' but not the correct answers), ProgramAssessment, and a newly-created AssessmentSubmission
// - facilitators: error (they shouldn't access this page)
// assessmentsRouter.get('/:assessmentId/submissions/new', (req, res) => {
//   const response = { behaviour: 'Creates a new draft submission' };
//   const { principalId } = req.session;
//   const { assessmentId, submissionId } = req.params;
//   const assessmentIdParsed = Number(assessmentId);
//   const submissionIdParsed = Number(submissionId);
//   let new_submission= [];
//   if (!Number.isInteger(assessmentIdParsed) || assessmentIdParsed < 1) {

//       new BadRequestError(
//         `"${assessmentIdParsed}" is not a valid participant id.`
//       );
//   }
//   if (!Number.isInteger(submissionIdParsed) || submissionIdParsed < 1) {

//       new BadRequestError(
//         `"${submissionIdParsed}" is not a valid participant id.`
//       );
//   }

//   res.status(200).json(itemEnvelope(response));
// });

// Outgoing:
// - participants: CurriculumAssessment (with 'questions' and 'answers' and correct answers (if graded)), ProgramAssessment, and AssessmentSubmission (with 'responses')
// - facilitator: CurriculumAssessment (with 'questions' and 'answers' and correct answers), ProgramAssessment, and AssessmentSubmission (with 'responses')
assessmentsRouter.get(
  '/:assessmentId/submissions/:submissionId',
  async (req, res, next) => {
    const { assessmentId, submissionId } = req.params;
    const assessmentIdParsed = Number(assessmentId);
    const submissionIdParsed = Number(submissionId);
    if (!Number.isInteger(assessmentIdParsed) || assessmentIdParsed < 1) {
      next(
        new BadRequestError(
          `"${assessmentIdParsed}" is not a valid participant id.`
        )
      );
    }
    if (!Number.isInteger(submissionIdParsed) || submissionIdParsed < 1) {
      next(
        new BadRequestError(
          `"${submissionIdParsed}" is not a valid participant id.`
        )
      );
    }
    let programId;

    let curriculumAssessment, programAssessment, AssessmentSubmitted,role;

    const response: SavedAssessment = {
      curriculum_assessment: curriculumAssessment,
      program_assessment: programAssessment,
      submission: AssessmentSubmitted ,
       principal_program_role:role
    };

    try {
      programId = await getProgramIdByProgramAssessmentId(assessmentIdParsed);

       role = await findRoleInProgram(2, programId[0].program_id);
      response.program_assessment = await programAssessmentById(
        assessmentIdParsed
      );

      if (role.title === 'Participant') {
        response.submission = await submissionDetails(
          submissionIdParsed,
          true,
          false
        );

        if (response.submission.assessment_submission_state === 'Graded') {
          response.curriculum_assessment = await getCurriculumAssessmentById(
            response.program_assessment.assessment_id,
            true,
            true,
            true
          );
        } else if (
          response.submission.assessment_submission_state === 'Submitted'
        ) {
          response.curriculum_assessment = await getCurriculumAssessmentById(
            response.program_assessment.assessment_id,
            true,
            false,
            false
          );
        } else {
        }
      } else if (role.title === 'Facilitator') {
        response.submission = await submissionDetails(
          submissionIdParsed,
          true,
          true
        );
        response.curriculum_assessment = await getCurriculumAssessmentById(
          response.program_assessment.assessment_id,
          true,
          true
        );
      } else {
        throw console.error('error');
      }
    } catch (error) {
      next(error);
      return;
    }
    res.json(itemEnvelope(response));
  }
);

// Incoming: AssessmentSubmission (with 'responses') (but participants shouldn't be allowed to update their scores or update their answers after it's been submitt)
// Outgoing: AssessmentSubmission (with 'responses')
assessmentsRouter.put(
  '/:assessmentId/submissions/:submissionId',
  (req, res) => {
    const response = { behaviour: 'Updates the state of a submission' };
    res.status(200).json(itemEnvelope(response));
  }
);

export default assessmentsRouter;
