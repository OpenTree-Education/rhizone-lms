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
  assessment_id: number;
  principal_id: number;
}

assessmentsDummyRouter.get(
  '/submitAssessment/:participantId',
  async (req, res, next) => {
    const { participantId } = req.params;
    let participantIdParsed, dummyAssessmentSubmissionData;

    try {
      participantIdParsed = Number(participantId);
      dummyAssessmentSubmissionData = {
        assessmentId: 1,
        principalId: participantIdParsed,
        assessmentSubmissionStateId: 7, // graded
        score: 10,
        openedAt: '2023-02-09 12:00:00',
        submittedAt: '2023-02-09 13:23:45',
        questions: [
          { id: 1, answerId: 4 },
          { id: 2, answerId: 5 },
          { id: 3, answerId: 9 },
          { id: 4, answerId: 14 },
          { id: 5, answerId: 18 },
          { id: 6, answerId: 21 },
          { id: 7, answerId: 23 },
          {
            id: 8,
            responseText:
              'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
          },
          {
            id: 9,
            responseText:
              'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
          },
          {
            id: 10,
            responseText:
              'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
          },
        ],
      };
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }

    let insertedAssessmentSubmissionsRow: AssessmentSubmissionRow[];
    try {
      insertedAssessmentSubmissionsRow = await insertToAssessmentSubmissions(
        dummyAssessmentSubmissionData.assessmentId,
        dummyAssessmentSubmissionData.principalId,
        dummyAssessmentSubmissionData.assessmentSubmissionStateId,
        dummyAssessmentSubmissionData.score,
        dummyAssessmentSubmissionData.openedAt,
        dummyAssessmentSubmissionData.submittedAt,
        dummyAssessmentSubmissionData.questions
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
  assessment_id: number;
  principal_id: number;
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
        questions: [
          { id: 1, answerId: 4 },
          { id: 2, answerId: 5 },
          { id: 3, answerId: 9 },
          { id: 4, answerId: 14 },
          { id: 5, answerId: 18 },
          { id: 6, answerId: 21 },
          { id: 7, answerId: 23 },
          {
            id: 8,
            responseText:
              'const HelloWorld = () => { return <p>Hello, World!</p>; }; export default HelloWorld;',
          },
          {
            id: 9,
            responseText:
              'React differs from other JavaScript frameworks because it uses a component-based architecture, a virtual DOM, JSX syntax, unidirectional data flow, and is primarily focused on building UIs rather than providing a complete application framework. These features make it faster, more efficient, and more flexible than other frameworks.',
          },
          {
            id: 10,
            responseText:
              'Benefits of using React include its modular and reusable components, efficient updates with virtual DOM, JSX syntax, and active community.',
          },
        ],
      };
    } catch (err) {
      next(new BadRequestError(err));
      return;
    }

    let insertedAssessmentSubmissionsRow: AssessmentSubmissionRow[];
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
