import { Router } from 'express';
import { DateTime } from 'luxon';

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './httpErrors';
import { collectionEnvelope, itemEnvelope } from './responseEnvelope';

import {
  AssessmentSubmission,
  AssessmentWithSubmissions,
  CurriculumAssessment,
  ProgramAssessment,
  AssessmentWithSummary,
  AssessmentDetails,
  SavedAssessment,
} from '../models';
import {
  constructFacilitatorAssessmentSummary,
  constructParticipantAssessmentSummary,
  createAssessmentSubmission,
  createCurriculumAssessment,
  createProgramAssessment,
  deleteCurriculumAssessment,
  deleteProgramAssessment,
  facilitatorProgramIdsMatchingCurriculum,
  findProgramAssessment,
  getAssessmentSubmission,
  getCurriculumAssessment,
  getPrincipalProgramRole,
  listAllProgramAssessmentSubmissions,
  listParticipantProgramAssessmentSubmissions,
  listPrincipalEnrolledProgramIds,
  listProgramAssessments,
  updateAssessmentSubmission,
  updateCurriculumAssessment,
  updateProgramAssessment,
} from '../services/assessmentsService';

const assessmentsRouter = Router();

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
                programAssessment
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
              await constructFacilitatorAssessmentSummary(programAssessment),
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
    return;
  }
});

assessmentsRouter.get(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    const { principalId } = req.session;
    const { curriculumAssessmentId } = req.params;
    const curriculumAssessmentIdParsed = Number(curriculumAssessmentId);

    if (
      !Number.isInteger(curriculumAssessmentIdParsed) ||
      curriculumAssessmentIdParsed < 1
    ) {
      next(
        new BadRequestError(
          `"${curriculumAssessmentIdParsed}" is not a valid submission ID.`
        )
      );
      return;
    }

    try {
      const includeQuestionsAndAllAnswers = true;
      const includeQuestionsAndCorrectAnswers = true;

      const curriculumAssessment = await getCurriculumAssessment(
        curriculumAssessmentIdParsed,
        includeQuestionsAndAllAnswers,
        includeQuestionsAndCorrectAnswers
      );

      if (!curriculumAssessment) {
        throw new NotFoundError(
          `Could not find curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      const matchingProgramIds = await facilitatorProgramIdsMatchingCurriculum(
        principalId,
        curriculumAssessment.curriculum_id
      );

      if (matchingProgramIds.length === 0) {
        throw new UnauthorizedError(
          `Not allowed to access curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      res.json(itemEnvelope(curriculumAssessment));
    } catch (err) {
      next(err);
      return;
    }
  }
);

assessmentsRouter.post('/curriculum', async (req, res, next) => {
  const { principalId } = req.session;
  const curriculumAssessmentFromUser = req.body;

  const isACurriculumAssessment = (
    possibleAssessment: unknown
  ): possibleAssessment is CurriculumAssessment => {
    return (possibleAssessment as CurriculumAssessment).title !== undefined;
  };
  if (!isACurriculumAssessment(curriculumAssessmentFromUser)) {
    next(new ValidationError(`Was not given a valid curriculum assessment.`));
    return;
  }

  try {
    const facilitatorProgramIds = await facilitatorProgramIdsMatchingCurriculum(
      principalId,
      curriculumAssessmentFromUser.curriculum_id
    );

    if (facilitatorProgramIds.length === 0) {
      throw new UnauthorizedError(
        `Not allowed to add a new assessment for this curriculum.`
      );
    }

    const curriculumAssessment = await createCurriculumAssessment(
      curriculumAssessmentFromUser
    );

    res.status(201).json(itemEnvelope(curriculumAssessment));
  } catch (error) {
    next(error);
    return;
  }
});

assessmentsRouter.put(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    const { principalId } = req.session;
    const { curriculumAssessmentId } = req.params;
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

    try {
      const curriculumAssessmentExisting = await getCurriculumAssessment(
        curriculumAssessmentIdParsed
      );

      if (!curriculumAssessmentExisting) {
        throw new NotFoundError(
          `Could not find curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      const matchingProgramAssessments =
        await facilitatorProgramIdsMatchingCurriculum(
          principalId,
          curriculumAssessmentExisting.curriculum_id
        );

      if (matchingProgramAssessments.length === 0) {
        throw new UnauthorizedError(
          `Not allowed to make modifications to curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      const updatedCurriculumAssessment: CurriculumAssessment =
        await updateCurriculumAssessment(curriculumAssessmentFromUser);

      if (!updatedCurriculumAssessment) {
        throw new InternalServerError(
          `Could not update curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      res.status(201).json(itemEnvelope(updatedCurriculumAssessment));
    } catch (err) {
      next(err);
      return;
    }
  }
);

assessmentsRouter.delete(
  '/curriculum/:curriculumAssessmentId',
  async (req, res, next) => {
    const { principalId } = req.session;
    const { curriculumAssessmentId } = req.params;
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

    try {
      const curriculumAssessmentExisting = await getCurriculumAssessment(
        curriculumAssessmentIdParsed
      );

      if (!curriculumAssessmentExisting) {
        throw new NotFoundError(
          `Could not find curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      const matchingPrograms = await facilitatorProgramIdsMatchingCurriculum(
        principalId,
        curriculumAssessmentExisting.curriculum_id
      );

      if (matchingPrograms.length === 0) {
        throw new UnauthorizedError(
          `Not allowed to delete curriculum assessment with ID ${curriculumAssessmentIdParsed}.`
        );
      }

      await deleteCurriculumAssessment(curriculumAssessmentIdParsed).catch(
        () => {
          throw new ConflictError(`Cannot delete a curriculum assessment.`);
        }
      );

      res.status(204).send();
    } catch (err) {
      next(err);
      return;
    }
  }
);

assessmentsRouter.get(
  '/program/:programAssessmentId',
  async (req, res, next) => {
    const { principalId } = req.session;
    const { programAssessmentId } = req.params;
    const programAssessmentIdParsed = Number(programAssessmentId);

    if (
      !Number.isInteger(programAssessmentIdParsed) ||
      programAssessmentIdParsed < 1
    ) {
      next(
        new BadRequestError(
          `"${programAssessmentIdParsed}" is not a valid submission ID.`
        )
      );
      return;
    }

    try {
      const programAssessment = await findProgramAssessment(
        programAssessmentIdParsed
      );

      if (!programAssessment) {
        throw new NotFoundError(
          `Could not find program assessment with ID ${programAssessmentIdParsed}.`
        );
      }

      const programRole = await getPrincipalProgramRole(
        principalId,
        programAssessment.program_id
      );

      if (programRole !== 'Facilitator') {
        throw new UnauthorizedError(
          `Could not access assessment with Program Assessment ID ${programAssessmentIdParsed}.`
        );
      }

      const includeQuestionsAndAllAnswers = true;
      const includeQuestionsAndCorrectAnswers = true;

      const curriculumAssessment = await getCurriculumAssessment(
        programAssessment.assessment_id,
        includeQuestionsAndAllAnswers,
        includeQuestionsAndCorrectAnswers
      );

      const assessmentDetails: AssessmentDetails = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
      };

      res.json(itemEnvelope(assessmentDetails));
    } catch (err) {
      next(err);
      return;
    }
  }
);

assessmentsRouter.post('/program', async (req, res, next) => {
  const { principalId } = req.session;
  const programAssessmentFromUser = req.body;

  let programAssessment;
  try {
    const isProgramAssessment = (
      possibleAssessment: unknown
    ): possibleAssessment is ProgramAssessment => {
      return (possibleAssessment as ProgramAssessment).program_id !== undefined;
    };

    if (!isProgramAssessment(programAssessmentFromUser)) {
      throw new BadRequestError(`Was not given a valid program assessment.`);
    }

    const programRole = await getPrincipalProgramRole(
      principalId,
      programAssessmentFromUser.program_id
    );

    if (programRole !== 'Facilitator') {
      throw new UnauthorizedError(
        `User is not allowed to create new program assessments for this program.`
      );
    }

    programAssessment = await createProgramAssessment(
      programAssessmentFromUser
    );
    res.status(201).json(itemEnvelope(programAssessment));
  } catch (error) {
    next(error);
    return;
  }
});

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

      const programRole = await getPrincipalProgramRole(
        principalId,
        programAssessment.program_id
      );

      if (programRole !== 'Facilitator') {
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
      res.status(201).json(itemEnvelope(updatedPrgramAssessment));
    } catch (error) {
      next(error);
      return;
    }
  }
);

assessmentsRouter.delete(
  '/program/:programAssessmentId',
  async (req, res, next) => {
    const { principalId } = req.session;
    const { programAssessmentId } = req.params;
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

    try {
      const matchingProgramAssessment = await findProgramAssessment(
        programAssessmentIdParsed
      );

      if (matchingProgramAssessment === null) {
        throw new NotFoundError(
          `Could not find program assessment with ID ${programAssessmentIdParsed}.`
        );
      }

      const programRole = await getPrincipalProgramRole(
        principalId,
        matchingProgramAssessment.program_id
      );

      if (programRole !== 'Facilitator') {
        throw new UnauthorizedError(
          `Not allowed to access program assessment with ID ${programAssessmentIdParsed}.`
        );
      }

      await deleteProgramAssessment(programAssessmentIdParsed).catch(() => {
        throw new ConflictError(
          `Cannot delete a program assessment that has participant submissions.`
        );
      });
    } catch (err) {
      next(err);
      return;
    }

    res.status(204).send();
  }
);

assessmentsRouter.get(
  '/program/:programAssessmentId/submissions',
  async (req, res, next) => {
    const { principalId } = req.session;
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

    let curriculumAssessment: CurriculumAssessment;
    let programAssessment: ProgramAssessment;
    let principalProgramRole: string;
    let submissions: AssessmentSubmission[];

    try {
      programAssessment = await findProgramAssessment(
        programAssessmentIdParsed
      );

      if (!programAssessment) {
        throw new NotFoundError(
          `Could not find program assessment with ID ${programAssessmentIdParsed}`
        );
      }

      const programRole = await getPrincipalProgramRole(
        principalId,
        programAssessment.program_id
      );

      switch (programRole) {
        case 'Participant':
          submissions = await listParticipantProgramAssessmentSubmissions(
            principalId,
            programAssessment.id
          );
          principalProgramRole = 'Participant';
          break;
        case 'Facilitator':
          submissions = await listAllProgramAssessmentSubmissions(
            programAssessment.id
          );
          principalProgramRole = 'Facilitator';
          break;
        default:
          throw new UnauthorizedError(
            `Could not access program assessment with ID ${programAssessmentIdParsed} without enrollment.`
          );
      }

      const includeQuestionsAndAllAnswers = false;
      const includeQuestionsAndCorrectAnswers = false;

      curriculumAssessment = await getCurriculumAssessment(
        programAssessment.assessment_id,
        includeQuestionsAndAllAnswers,
        includeQuestionsAndCorrectAnswers
      );

      const assessmentWithSubmissions: AssessmentWithSubmissions = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        principal_program_role: principalProgramRole,
        submissions,
      };

      res.json(itemEnvelope(assessmentWithSubmissions));
    } catch (error) {
      next(error);
      return;
    }
  }
);

assessmentsRouter.get(
  '/program/:programAssessmentId/submissions/new',
  async (req, res, next) => {
    const { principalId } = req.session;
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
        throw new NotFoundError(
          `Could not find program assessment with ID ${programAssessmentIdParsed}.`
        );
      }

      if (
        DateTime.fromISO(programAssessment.available_after) > DateTime.now()
      ) {
        throw new ForbiddenError(
          `Could not create a new submission of an assessment that's not yet available.`
        );
      }

      if (DateTime.fromISO(programAssessment.due_date) < DateTime.now()) {
        throw new ForbiddenError(
          `Could not create a new submission of an assessment after its due date.`
        );
      }

      const programRole = await getPrincipalProgramRole(
        principalId,
        programAssessment.program_id
      );

      if (!programRole) {
        throw new UnauthorizedError(
          `Could not access program assessment with ID ${programAssessmentIdParsed}) without enrollment.`
        );
      }

      if (programRole === 'Facilitator') {
        throw new UnauthorizedError(
          `Facilitators are not allowed to create program assessment submissions.`
        );
      }

      const includeQuestionsAndAllAnswers = true;
      const includeQuestionsAndCorrectAnswers = false;
      const curriculumAssessment = await getCurriculumAssessment(
        programAssessment.assessment_id,
        includeQuestionsAndAllAnswers,
        includeQuestionsAndCorrectAnswers
      );

      const existingAssessmentSubmissions =
        await listParticipantProgramAssessmentSubmissions(
          principalId,
          programAssessment.id
        );

      let assessmentSubmission: AssessmentSubmission;

      if (!existingAssessmentSubmissions) {
        assessmentSubmission = await createAssessmentSubmission(
          principalId,
          programAssessmentIdParsed,
          programAssessment.assessment_id
        );
      } else {
        const inProgressSubmissions: AssessmentSubmission[] =
          existingAssessmentSubmissions.filter(assessmentSubmission =>
            ['Opened', 'In Progress'].includes(
              assessmentSubmission.assessment_submission_state
            )
          );
        if (inProgressSubmissions.length !== 0) {
          assessmentSubmission = await getAssessmentSubmission(
            inProgressSubmissions[0].id,
            true,
            false
          );
        } else if (
          existingAssessmentSubmissions.length >=
            curriculumAssessment.max_num_submissions &&
          inProgressSubmissions.length === 0
        ) {
          throw new ForbiddenError(
            `Could not create a new submission as you have reached the maximum number of submissions for this assessment.`
          );
        } else {
          assessmentSubmission = await createAssessmentSubmission(
            principalId,
            programAssessmentIdParsed,
            programAssessment.assessment_id
          );
        }
      }

      const assessmentWithSubmission: SavedAssessment = {
        curriculum_assessment: curriculumAssessment,
        program_assessment: programAssessment,
        principal_program_role: programRole,
        submission: assessmentSubmission,
      };

      res.json(itemEnvelope(assessmentWithSubmission));
    } catch (err) {
      next(err);
      return;
    }
  }
);

assessmentsRouter.get('/submissions/:submissionId', async (req, res, next) => {
  const { principalId } = req.session;
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
    const assessmentSubmission = await getAssessmentSubmission(
      submissionIdParsed,
      true
    );

    if (!assessmentSubmission) {
      next(
        new NotFoundError(
          `Could not find submission with ID ${submissionIdParsed}.`
        )
      );
      return;
    }

    const programAssessmentId = assessmentSubmission.assessment_id;
    const programAssessment = await findProgramAssessment(programAssessmentId);

    const programRole = await getPrincipalProgramRole(
      principalId,
      programAssessment.program_id
    );

    if (!programRole) {
      next(
        new UnauthorizedError(
          `Could not access submission with ID ${submissionIdParsed}.`
        )
      );
      return;
    }

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

    const includeQuestionsAndAllAnswers = true;
    const includeQuestionsAndCorrectAnswers =
      programRole === 'Facilitator' ||
      assessmentSubmission.assessment_submission_state === 'Graded';

    const curriculumAssessment = await getCurriculumAssessment(
      programAssessment.assessment_id,
      includeQuestionsAndAllAnswers,
      includeQuestionsAndCorrectAnswers
    );

    const assessmentWithSubmission: SavedAssessment = {
      curriculum_assessment: curriculumAssessment,
      program_assessment: programAssessment,
      principal_program_role: programRole,
      submission: assessmentSubmission,
    };

    res.json(itemEnvelope(assessmentWithSubmission));
  } catch (err) {
    next(err);
    return;
  }
});

assessmentsRouter.put('/submissions/:submissionId', async (req, res, next) => {
  const { principalId } = req.session;
  const { submissionId } = req.params;
  const submissionIdParsed = Number(submissionId);
  const submissionFromUser = req.body;

  try {
    if (!Number.isInteger(submissionIdParsed) || submissionIdParsed < 1) {
      throw new BadRequestError(
        `"${submissionIdParsed}" is not a valid submission ID.`
      );
    }

    const isSubmission = (
      possibleSubmission: unknown
    ): possibleSubmission is AssessmentSubmission => {
      return (possibleSubmission as AssessmentSubmission).id !== undefined;
    };

    if (!isSubmission(submissionFromUser)) {
      throw new ValidationError(`Was not given a valid assessment submission.`);
    }

    if (submissionFromUser.id !== submissionIdParsed) {
      throw new BadRequestError(
        `The submission id in the parameter(${submissionIdParsed}) is not the same id as in the request body (${submissionFromUser.id}).`
      );
    }

    const existingAssessmentSubmission = await getAssessmentSubmission(
      submissionIdParsed,
      true
    );

    if (!existingAssessmentSubmission) {
      throw new NotFoundError(
        `Could not find submission with ID ${submissionIdParsed}.`
      );
    }

    const programAssessment = await findProgramAssessment(
      submissionFromUser.assessment_id
    );

    const programRole = await getPrincipalProgramRole(
      principalId,
      programAssessment.program_id
    );

    if (!programRole) {
      throw new UnauthorizedError(
        `Could not access the assessment and submssion without enrollment in the program or being a facilitator.`
      );
    }

    if (
      submissionFromUser.principal_id !== principalId &&
      programRole !== 'Facilitator'
    ) {
      throw new UnauthorizedError(
        `You may not update an assessment that is not your own.`
      );
    }

    let updatedSubmission: AssessmentSubmission;

    if (programRole === 'Facilitator') {
      updatedSubmission = await updateAssessmentSubmission(
        submissionFromUser,
        programRole === 'Facilitator'
      );
    } else if (
      ['Opened', 'In Progress'].includes(
        existingAssessmentSubmission.assessment_submission_state
      )
    ) {
      updatedSubmission = await updateAssessmentSubmission(
        submissionFromUser,
        programRole === 'Facilitator'
      );
    } else {
      updatedSubmission = await getAssessmentSubmission(
        existingAssessmentSubmission.id,
        true,
        programRole === 'Facilitator'
      );
    }

    res.status(201).json(itemEnvelope(updatedSubmission));
  } catch (err) {
    next(err);
    return;
  }
});

export default assessmentsRouter;
