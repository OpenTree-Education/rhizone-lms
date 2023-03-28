import { Router } from 'express';

import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './httpErrors';
import {
  itemEnvelope,
  errorEnvelope,
  collectionEnvelope,
} from './responseEnvelope';

import {
  CurriculumAssessment,
  ProgramAssessment,
  AssessmentWithSummary,
  SavedAssessment,
} from '../models';
import {
  calculateNumProgramParticipants,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  updateCurriculumAssessment,
  listAssessmentQuestions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  constructParticipantAssessmentSummary,
  constructFacilitatorAssessmentSummary,
} from '../services/assessmentsService';

const assessmentsRouter = Router();

//List all AssessmentWithSummary to which the user has access
assessmentsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;

  try {
    const programIds = await listPrincipalEnrolledProgramIds(principalId);

    const assessmentsSummaryList: AssessmentWithSummary[] = [];

    if (programIds.length === 0) {
      res.json(collectionEnvelope(assessmentsSummaryList, 0));
      return;
    }

    for (const programId of programIds) {
      const roleInProgram = await getPrincipalProgramRole(
        principalId,
        programId
      );
      const programAssessments = await listProgramAssessments(programId);

      for (const programAssessment of programAssessments) {
        if (roleInProgram === 'Participant') {
          assessmentsSummaryList.push({
            curriculum_assessment: await getCurriculumAssessment(
              programAssessment.assessment_id,
              false,
              false
            ),
            program_assessment: programAssessment,
            participant_submissions_summary:
              await constructParticipantAssessmentSummary(
                principalId,
                programAssessment.assessment_id
              ),
            principal_program_role: roleInProgram,
          });
        }

        if (roleInProgram === 'Facilitator') {
          assessmentsSummaryList.push({
            curriculum_assessment: await getCurriculumAssessment(
              programAssessment.assessment_id,
              false,
              false
            ),
            program_assessment: programAssessment,
            facilitator_submissions_summary:
              await constructFacilitatorAssessmentSummary(
                programAssessment.assessment_id,
                programId
              ),
            principal_program_role: roleInProgram,
          });
        }
      }
    }
    res.json(
      collectionEnvelope(assessmentsSummaryList, assessmentsSummaryList.length)
    );
  } catch (error) {
    next(error);
  }
});

assessmentsRouter.get('/test', async (req, res, next) => {
  const test = await constructParticipantAssessmentSummary(2, 1);
  res.json(test);
});

// Get details of a specific CurriculumAssessment
assessmentsRouter.get(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    res.json();
  }
);
// Create a new CurriculumAssessment
assessmentsRouter.post('/curriculum', async (req, res, next) => {
  res.json();
});

// Update an existing CurriculumAssessment
assessmentsRouter.put(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    // step 1: get the principal ID number
    const { principalId } = req.session;

    // step 2: get the curriculum assessment ID number from the URL parameters
    const { curriculumAssessmentId } = req.params;

    // step 3: parse the curriculum assessment ID number
    // to ensure it's an integer
    const curriculumAssessmentIdParsed = Number(curriculumAssessmentId);

    if (
      !Number.isInteger(curriculumAssessmentIdParsed) ||
      curriculumAssessmentIdParsed < 1
    ) {
      next(
        new BadRequestError(
          `"${curriculumAssessmentIdParsed}" is not a valid curriculum assessment ID.`
        )
      );
      return;
    }

    // step 4: get the curriculum assessment that we receive
    // through the request body
    const curriculumAssessmentFromUser = req.body;

    const isACurriculumAssessment = (
      possibleAssessment: unknown
    ): possibleAssessment is CurriculumAssessment => {
      return (possibleAssessment as CurriculumAssessment).id !== undefined;
    };

    if (!isACurriculumAssessment(curriculumAssessmentFromUser)) {
      next(new ValidationError(`Was not given a valid curriculum assessment.`));
      return;
    }

    // step 5: check to make sure the curriculum assessment already exists
    // because our route is in charge of updating an *existing* curriculum
    // assessment, so error out if the curriculum assessment doesn't exist
    const curriculumAssessmentExisting = getCurriculumAssessment(
      curriculumAssessmentIdParsed
    );

    if (!curriculumAssessmentExisting) {
      next(
        new NotFoundError(
          `Could not find curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        )
      );
      return;
    }

    // step 6: make sure the user is the facilitator of a program that uses
    // this curriculum assessment
    const matchingProgramAssessments =
      await facilitatorProgramAssessmentsForCurriculumAssessment(
        principalId,
        curriculumAssessmentIdParsed
      );

    // If there are no matching program assessments with this curriculum ID,
    // then we are not facilitator of any programs where we can modify this
    // CurriculumAssessment, so let's return an error to the user.
    // if (matchingProgramAssessments.length === 0) {
    //   next(
    //     new UnauthorizedError(
    //       `Not allowed to make modifications to curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
    //     )
    //   );
    //   return;
    // }

    // step 7: update the curriculum assessment, its questions, and its answers
    const updatedCurriculumAssessment: CurriculumAssessment =
      await updateCurriculumAssessment(curriculumAssessmentFromUser);

    // step 8: return the updated curriculum assessment to the user,
    // including questions and answers
    if (!updatedCurriculumAssessment) {
      next(
        new InternalServerError(
          `Could not update curriculum assessment with ID ${curriculumAssessmentIdParsed}`
        )
      );
      return;
    }

    res.json(itemEnvelope(updatedCurriculumAssessment));
  }
);

// Delete an existing CurriculumAssessment
assessmentsRouter.delete(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    res.json();
  }
);

// Get a specific AssessmentDetails
assessmentsRouter.get(
  '/program/:programAssessmentId',
  async (req, res, next) => {
    res.json();
  }
);
// Create a new ProgramAssessment
assessmentsRouter.post('/program', async (req, res, next) => {
  res.json();
});
// Update an existing ProgramAssessment
assessmentsRouter.put(
  '/program/:programAssessmentId',
  async (req, res, next) => {
    res.json();
  }
);
// Delete an existing ProgramAssessment
assessmentsRouter.delete(
  '/program/:programAssessmentId',
  async (req, res, next) => {
    res.json();
  }
);

// Get an AssessmentWithSubmissions
assessmentsRouter.get(
  '/program/:programAssessmentId/submissions',
  async (req, res, next) => {
    res.json();
  }
);
// Start a new AssessmentSubmission
assessmentsRouter.get(
  '/program/:programAssessmentId/submissions/new',
  async (req, res, next) => {
    res.json();
  }
);

// Get details of a specific SavedAssessment
// assessmentsRouter.get('/submissions/:submissionId', async (req, res, next) => {
//   // get the principal row ID number
//   const { principalId } = req.session;

//   // get and parse the assessment submission row ID number
//   // error out if we were passed an invalid assessment submission row ID number
//   const { submissionId } = req.params;
//   const submissionIdParsed = Number(submissionId);

//   if (!Number.isInteger(submissionIdParsed) || submissionIdParsed < 1) {
//     next(
//       new BadRequestError(
//         `"${submissionIdParsed}" is not a valid submission ID.`
//       )
//     );
//     return;
//   }

//   // get the assessment submission and responses
//   const assessmentSubmission = await getAssessmentSubmission(
//     submissionIdParsed,
//     true
//   );

//   // if the assessment submission is null/falsy, that means there's no matching
//   // assessment submission. send an error back to the user.
//   if (!assessmentSubmission) {
//     next(
//       new NotFoundError(
//         `Could not find submission with ID ${submissionIdParsed}.`
//       )
//     );
//     return;
//   }

//   // get the program assessment, which should be guaranteed to exist.
//   const programAssessmentId = assessmentSubmission.assessment_id;
//   const programAssessment = await findProgramAssessment(programAssessmentId);

//   // get the principal program role
//   const programRole = await getPrincipalProgramRole(
//     principalId,
//     programAssessment.program_id
//   );

//   // if the program role is null/falsy, that means the user is not enrolled in
//   // the program. send an error back to the user.
//   if (!programRole) {
//     next(
//       new UnauthorizedError(
//         `Could not access submission with ID ${submissionIdParsed}.`
//       )
//     );
//     return;
//   }

//   // also, if the program role is "Participant" and the principal ID of the
//   // AssessmentSubmission doesn't match the logged-in principal ID, we should
//   // return an error to the user.
//   if (programRole === 'Participant') {
//     if (principalId !== assessmentSubmission.principal_id) {
//       next(
//         new UnauthorizedError(
//           `Could not access submission with ID ${submissionIdParsed}.`
//         )
//       );
//       return;
//     }
//   }

//   // for this route, we always want to return the questions and all answer
//   // options in all cases.
//   const includeQuestionsAndAllAnswers = true;

//   // if the program role is facilitator, we should always return the correct
//   // answers. otherwise, return the correct answers only if the submission has
//   // been graded.
//   const includeQuestionsAndCorrectAnswers =
//     programRole === 'Facilitator' ||
//     assessmentSubmission.assessment_submission_state === 'Graded';

//   // get the curriculum assessment
//   const curriculumAssessment = await getCurriculumAssessment(
//     programAssessment.assessment_id,
//     includeQuestionsAndAllAnswers,
//     includeQuestionsAndCorrectAnswers
//   );

//   // let's construct our return value
//   const assessmentWithSubmission: SavedAssessment = {
//     curriculum_assessment: curriculumAssessment,
//     program_assessment: programAssessment,
//     principal_program_role: programRole,
//     submission: assessmentSubmission,
//   };

//   // let's return that to the user

//   res.json(itemEnvelope(assessmentWithSubmission));
// });

// Update details of a specific AssessmentSubmission
assessmentsRouter.put('/submissions/:submissionId', async (req, res, next) => {
  res.json();
});

export default assessmentsRouter;
function getParticipantAssessmentSubmissionsSummary(
  assessment_id: any,
  principalId: number
):
  | import('../models').ParticipantAssessmentSubmissionsSummary
  | PromiseLike<import('../models').ParticipantAssessmentSubmissionsSummary> {
  throw new Error('Function not implemented.');
}
function facilitatorProgramAssessmentsForCurriculumAssessment(
  principalId: number,
  curriculumAssessmentIdParsed: number
) {
  throw new Error('Function not implemented.');
}
