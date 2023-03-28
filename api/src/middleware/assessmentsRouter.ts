import { Router } from 'express';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from './httpErrors';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';

import { SavedAssessment } from '../models';
import {
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listParticipantProgramAssessmentSubmissions,
  createAssessmentSubmission,
} from '../services/assessmentsService';

const assessmentsRouter = Router();

// List all AssessmentWithSummary to which the user has access
assessmentsRouter.get('/', async (req, res, next) => {
  res.json();
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
    res.json();
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
    // get the principal row ID number
    const { principalId } = req.session;

    // get and parse the program assessment row ID number
    const { programAssessmentId } = req.params;

    const programAssessmentIdParsed = Number(programAssessmentId);

    if (
      !Number.isInteger(programAssessmentIdParsed) ||
      programAssessmentIdParsed < 1
    ) {
      next(
        new BadRequestError(
          `"${programAssessmentId}" is not a valid program assessment ID.`
        )
      );
      return;
    }

    try {
      const programAssessment = await findProgramAssessment(
        programAssessmentIdParsed
      );

      if (!programAssessment) {
        next(
          new NotFoundError(
            `Could not find program assessment(ID ${programAssessmentIdParsed}).`
          )
        );
        return;
      }

      if (new Date(programAssessment.available_after + 'Z') > new Date()) {
        next(
          new UnauthorizedError(
            `Could not create a new submission of an assessment that's not yet available.`
          )
        );
        return;
      }

      if (new Date(programAssessment.due_date + 'Z') < new Date()) {
        next(
          new UnauthorizedError(
            `Could not create a new submission of an assessment that passed due date.`
          )
        );
        return;
      }

      const programRole = await getPrincipalProgramRole(
        principalId,
        programAssessment.program_id
      );

      if (!programRole) {
        next(
          new UnauthorizedError(
            `Could not access program accessment(ID ${programAssessmentIdParsed}) without enrollment.`
          )
        );
        return;
      }

      if (programRole === 'Facilitator') {
        next(
          new UnauthorizedError(
            `Could not create a new submission as a facilitator.`
          )
        );
        return;
      }

      // get the curriculum assessment, without its answer and correct answers.
      const curriculumAssessment = await getCurriculumAssessment(programAssessmentIdParsed);

      // get the list of the programm assessment submission
      const assessmentSubmissions =
        await listParticipantProgramAssessmentSubmissions(
          principalId,
          programAssessment.id
        );

      if (
        assessmentSubmissions &&
        assessmentSubmissions.length >= curriculumAssessment.max_num_submissions
      ) {
        next(
          new UnauthorizedError(
            `Could not create a new submission becasue it has reach the maximum number of submission.`
          )
        );
        return;
      }

      if (assessmentSubmissions &&
        assessmentSubmissions.some(
          a =>
            a.assessment_submission_state === 'Opened' ||
            a.assessment_submission_state === 'In Progress'
        )
      ) {
        next(
          new UnauthorizedError(
            `Could not create a new submission becasue an Opened/In Progress submission alreay exisits.`
          )
        );
        return;
      }

      const newSubmission = await createAssessmentSubmission(
        principalId,
        programAssessmentIdParsed
      );

      res.json(itemEnvelope(newSubmission));
    } catch (err) {
      next(err);
      return;
    }
  }
);

// Get details of a specific SavedAssessment
assessmentsRouter.get('/submissions/:submissionId', async (req, res, next) => {
  // get the principal row ID number
  const { principalId } = req.session;

  // get and parse the assessment submission row ID number
  // error out if we were passed an invalid assessment submission row ID number
  const { submissionId } = req.params;

  const submissionIdParsed = Number(submissionId);

  if (!Number.isInteger(submissionIdParsed) || submissionIdParsed < 1) {
    next(
      new BadRequestError(
        `"${submissionIdParsed}" is not a valid submission ID.`
      )
    );
    return;
  }

  try {
    // get the assessment submission and responses
    const assessmentSubmission = await getAssessmentSubmission(
      submissionIdParsed,
      true
    );

    // if the assessment submission is null/falsy, that means there's no matching
    // assessment submission. send an error back to the user.
    if (!assessmentSubmission) {
      next(
        new NotFoundError(
          `Could not find submission with ID ${submissionIdParsed}.`
        )
      );
      return;
    }

    // get the program assessment, which should be guaranteed to exist.
    const programAssessmentId = assessmentSubmission.assessment_id;

    const programAssessment = await findProgramAssessment(programAssessmentId);

    // get the principal program role
    const programRole = await getPrincipalProgramRole(
      principalId,
      programAssessment.program_id
    );

    // if the program role is null/falsy, that means the user is not enrolled in
    // the program. send an error back to the user.
    if (!programRole) {
      next(
        new UnauthorizedError(
          `Could not access submission with ID ${submissionIdParsed}.`
        )
      );
      return;
    }

    // also, if the program role is "Participant" and the principal ID of the
    // AssessmentSubmission doesn't match the logged-in principal ID, we should
    // return an error to the user.
    if (programRole === 'Participant') {
      if (principalId !== assessmentSubmission.principal_id) {
        next(
          new UnauthorizedError(
            `Could not access submission with ID ${submissionIdParsed}.`
          )
        );
        return;
      }
    }

    // for this route, we always want to return the questions and all answer
    // options in all cases.
    const includeQuestionsAndAllAnswers = true;

    // if the program role is facilitator, we should always return the correct
    // answers. otherwise, return the correct answers only if the submission has
    // been graded.
    const includeQuestionsAndCorrectAnswers =
      programRole === 'Facilitator' ||
      assessmentSubmission.assessment_submission_state === 'Graded';

    // get the curriculum assessment
    const curriculumAssessment = await getCurriculumAssessment(
      programAssessment.assessment_id,
      includeQuestionsAndAllAnswers,
      includeQuestionsAndCorrectAnswers
    );

    // let's construct our return value
    const assessmentWithSubmission: SavedAssessment = {
      curriculum_assessment: curriculumAssessment,
      program_assessment: programAssessment,
      principal_program_role: programRole,
      submission: assessmentSubmission,
    };

    // let's return that to the user

    res.json(itemEnvelope(assessmentWithSubmission));
  } catch (err) {
    next(err);
    return;
  }
});

// Update details of a specific AssessmentSubmission
assessmentsRouter.put('/submissions/:submissionId', async (req, res, next) => {
  res.json();
});

export default assessmentsRouter;
