import { Router } from 'express';

import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
} from './httpErrors';
import { itemEnvelope, collectionEnvelope } from './responseEnvelope';

import {
  CurriculumAssessment,
  ProgramAssessment,
  SavedAssessment,
  AssessmentSubmission,
} from '../models';
import {
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  facilitatorProgramAssessmentsForCurriculumAssessment,
  updateCurriculumAssessment,
  updateProgramAssessment,
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
    if (matchingProgramAssessments.length === 0) {
      next(
        new UnauthorizedError(
          `Not allowed to make modifications to curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        )
      );
      return;
    }

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
    const { programAssessmentId } = req.params;
    const { principalId } = req.session;
    const programAssessmentFromUser = req.body;
    const programAssessmentIdParsed = Number(programAssessmentId);
    if (
      !Number.isInteger(programAssessmentIdParsed) ||
      programAssessmentIdParsed < 1
    ) {
      next(
        new BadRequestError(
          `"${programAssessmentIdParsed}" is not a valid program assessment ID.`
        )
      );
      return;
    }
    let updatedPrgramAssessment;
    try {
      const programAssessment = await findProgramAssessment(
        programAssessmentIdParsed
      );

      if (programAssessment === null) {
        throw new NotFoundError(
          `Could not find program assessment with ID ${programAssessmentIdParsed}.`
        );
      }

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
            `Could not access program Assessment with ID ${programAssessmentIdParsed}.`
          )
        );
        return;
      }

      const isprogramAssessment = (
        possibleAssessment: unknown
      ): possibleAssessment is ProgramAssessment => {
        return (possibleAssessment as ProgramAssessment).id !== undefined;
      };

      if (!isprogramAssessment(programAssessmentFromUser)) {
        next(new BadRequestError(`Was not given a valid program assessment.`));
        return;
      }

      updatedPrgramAssessment = await updateProgramAssessment(
        programAssessmentFromUser
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(updatedPrgramAssessment));
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
  // get the principal row ID number
  const { principalId } = req.session;
  const { submissionId } = req.params;
  const submissionIdParsed = Number(submissionId);
  const submissionFromUser = req.body;
  let updatedSubmission;

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
    const assessmentSubmissionExisting = await getAssessmentSubmission(
      submissionIdParsed,
      true
    );

    // if the assessment submission is null/falsy, that means there's no matching
    // assessment submission. send an error back to the user.
    if (!assessmentSubmissionExisting) {
      next(
        new NotFoundError(
          `Could not find submission with ID ${submissionIdParsed}.`
        )
      );
      return;
    }

    // make sure it is a valid submission from body with an id.
    const isSubmission = (
      possibleSubmission: unknown
    ): possibleSubmission is AssessmentSubmission => {
      return (possibleSubmission as AssessmentSubmission).id !== undefined;
    };

    if (!isSubmission(submissionFromUser)) {
      next(new BadRequestError(`Was not given a valid assessment submission.`));
      return;
    }

    // make sure the submssion id from param is same from request body
    if (assessmentSubmissionExisting.id !== submissionIdParsed) {
      next(
        new BadRequestError(
          `The submission id in the parameter(${submissionIdParsed}) is not the same id as in the request body (${assessmentSubmissionExisting.id}).`
        )
      );
      return;
    }

    // get program assessment 
    const programAssessment = await findProgramAssessment(
      submissionFromUser.assessment_id
    );

    if (!programAssessment) {
      next(
        new NotFoundError(
          `Could not find program assessment(with ID ${submissionFromUser.assessment_id}) provided by submission body.`
        )
      );
      return;
    }

    // Get program assessment role
    const programRole = await getPrincipalProgramRole(
      principalId,
      programAssessment.program_id
    );

    if (programRole && programRole === 'Participant ') {
      if (new Date(programAssessment.available_after + 'Z') > new Date()) {
        next(
          new ForbiddenError(
            `Could not update a new submission of an assessment that's not yet available.`
          )
        );
        return;
      }
      // pas due and its in open/inprogrss -> set expire -> return forbident
      if (new Date(programAssessment.due_date + 'Z') < new Date()) {
        if (
          assessmentSubmissionExisting.assessment_submission_state ===
            'Opened' ||
          assessmentSubmissionExisting.assessment_submission_state ===
            'In Progress'
        ) {
        }
        next(
          new UnauthorizedError(
            `Could not create a new submission of an assessment that passed due date.`
          )
        );
        return;
      }

      //not open or in progreaa? -> forbident
      // in open and progrew -> update but disallowing them to update their scores or graderResponse
    } else if (programRole && programRole === 'Facilitator') {
    } else {
      next(
        new UnauthorizedError(
          `Could not access the assessment and submssion without enrollment in the program or being a facilitator.`
        )
      );
      return;
    }

    res.json(itemEnvelope(submissionFromUser));
  } catch (err) {
    next(err);
    return;
  }
});

export default assessmentsRouter;
