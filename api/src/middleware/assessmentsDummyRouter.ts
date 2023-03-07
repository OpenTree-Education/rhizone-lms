import { Router } from 'express';

import { itemEnvelope } from './responseEnvelope';
import { BadRequestError } from './httpErrors';
import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
} from '../services/assessmentsDummyService';
const assessmentsDummyRouter = Router();

interface ProgramParticipantsRow {
  id: number;
  principal_id?: number;
  program_id?: number;
  role_id?: number;
}

assessmentsDummyRouter.get(
  '/makeParticipant/:programId/:participantId',
  async (req, res, next) => {
    const { programId, participantId } = req.params;
    // a role ID of 1 corresponds to a participant
    const roleId = 1;
    let programIdParsed, participantIdParsed;
    try {
      programIdParsed = Number(programId);
      participantIdParsed = Number(participantId);
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }
    let insertedProgramParticipantsRow: ProgramParticipantsRow;
    try {
      insertedProgramParticipantsRow = await insertToProgramParticipants(
        participantIdParsed,
        programIdParsed,
        roleId
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(insertedProgramParticipantsRow));
  }
);

interface AssessmentSubmissionRow {
  id: number;
  assessment_id?: number;
  principal_id?: number;
}

assessmentsDummyRouter.get(
  '/submitAssessment/:participantId',
  async (req, res, next) => {
    const { participantId } = req.params;
    let participantIdParsed, dummyAssessmentSubmissionData;

    try {
      participantIdParsed = Number(participantId);
      dummyAssessmentSubmissionData = [
        {
          submission_id: 2,
          assessment_id: 1,
          principal_id: participantIdParsed,
          assessment_submission_state_id: 7, // graded
          score: 10,
          opened_at: '2023-02-09 12:00:00',
          submitted_at: '2023-02-09 13:23:45',
          responses: [
            {
              id: 1,
              answer_id: 4,
              assessment_id: 1,
              submission_id: 2,
              question_id: 1,
            },
            {
              id: 2,
              answer_id: 5,
              assessment_id: 1,
              submission_id: 2,
              question_id: 2,
            },
            {
              id: 3,
              answer_id: 9,
              assessment_id: 1,
              submission_id: 2,
              question_id: 3,
            },
            {
              id: 4,
              answer_id: 14,
              assessment_id: 1,
              submission_id: 2,
              question_id: 4,
            },
            {
              id: 5,
              answer_id: 18,
              assessment_id: 1,
              submission_id: 2,
              question_id: 5,
            },
            {
              id: 6,
              answer_id: 21,
              assessment_id: 1,
              submission_id: 2,
              question_id: 6,
            },
            {
              id: 7,
              answer_id: 23,
              assessment_id: 1,
              submission_id: 2,
              question_id: 7,
            },
            {
              id: 8,
              response:
                'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
              assessment_id: 1,
              submission_id: 2,
              question_id: 8,
            },
            {
              id: 9,
              response:
                'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
              assessment_id: 1,
              submission_id: 2,
              question_id: 9,
            },
            {
              id: 10,
              response:
                'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
              assessment_id: 1,
              submission_id: 2,
              question_id: 10,
            },
          ],
        },
      ];
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }

    let insertedAssessmentSubmissionsRow: AssessmentSubmissionRow;
    try {
      insertedAssessmentSubmissionsRow = await insertToAssessmentSubmissions(
        dummyAssessmentSubmissionData[0].assessment_id,
        dummyAssessmentSubmissionData[0].principal_id,
        dummyAssessmentSubmissionData[0].assessment_submission_state_id,
        dummyAssessmentSubmissionData[0].score,
        dummyAssessmentSubmissionData[0].opened_at,
        dummyAssessmentSubmissionData[0].submitted_at,
        dummyAssessmentSubmissionData[0].responses
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(insertedAssessmentSubmissionsRow));
  }
);

assessmentsDummyRouter.get(
  '/makeFacilitator/:programId/:participantId',
  async (req, res, next) => {
    const { programId, participantId } = req.params;
    // a role ID of 2 corresponds to a Facilitator
    const roleId = 2;
    let programIdParsed, participantIdParsed;
    try {
      programIdParsed = Number(programId);
      participantIdParsed = Number(participantId);
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }
    let insertedProgramFacilitatorsRow: ProgramParticipantsRow;
    try {
      insertedProgramFacilitatorsRow = await insertToProgramParticipants(
        participantIdParsed,
        programIdParsed,
        roleId
      );
    } catch (error) {
      next(error);
      return;
    }
    res.status(201).json(itemEnvelope(insertedProgramFacilitatorsRow));
  }
);
interface AssessmentStartRow {
  id: number;
  assessment_id?: number;
  principal_id?: number;
}
assessmentsDummyRouter.get(
  '/startAssessment/:assessmentId/:participantId',
  async (req, res, next) => {
    const { assessmentId, participantId } = req.params;
    let participantIdParsed, assessmentIdParsed, dummyAssessmentSubmissionData;
    try {
      participantIdParsed = Number(participantId);
      assessmentIdParsed = Number(assessmentId);
      dummyAssessmentSubmissionData = {
        assessmentId: assessmentIdParsed,
        principalId: participantIdParsed,
        assessmentSubmissionStateId: 7, // graded
        score: 10,
        openedAt: '2023-02-09 12:00:00',
        submittedAt: '2023-02-09 13:23:45',
        questions: [],
      };
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }

    let insertedAssessmentSubmissionsRow: AssessmentStartRow;
    try {
      insertedAssessmentSubmissionsRow = await insertToAssessmentSubmissions(
        dummyAssessmentSubmissionData.assessmentId,
        dummyAssessmentSubmissionData.principalId,
        dummyAssessmentSubmissionData.assessmentSubmissionStateId,
        dummyAssessmentSubmissionData.score,
        dummyAssessmentSubmissionData.openedAt,
        dummyAssessmentSubmissionData.submittedAt,
        []
      );
    } catch (error) {
      next(error);
      return;
    }

    res.status(201).json(itemEnvelope(insertedAssessmentSubmissionsRow));
  }
);

export default assessmentsDummyRouter;
