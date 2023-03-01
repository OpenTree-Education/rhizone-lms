import { Router } from 'express';

import { collectionEnvelope, itemEnvelope } from './responseEnvelope';
import { BadRequestError } from './httpErrors';
import {
  insertToProgramParticipants,
  insertToAssessmentSubmissions,
  insertToAssessmentResponses,
} from '../services/assessmentsDummyService';
const assessmentsDummyRouter = Router();

assessmentsDummyRouter.get(
  '/makeParticipant/:programId/:participantId',
  async (req, res, next) => {
    // const {principalId } = req.session;
    const { programId, participantId } = req.params;
    // a role ID of 1 corresponds to a participant
    const roleId = 1;
    const programIdParsed = Number(programId);
    const participantIdParsed = Number(participantId);

    let programParticipantRowId;
    try {
      programParticipantRowId = await insertToProgramParticipants(
        participantIdParsed,
        programIdParsed,
        roleId
      );
    } catch (error) {
      next(error);
      return;
    }
    res.json(
      itemEnvelope({
        participantIdParsed,
        programIdParsed,
        roleId,
      })
    );
  }
);

assessmentsDummyRouter.get(
  '/submitAssessment/:participantId',
  async (req, res, next) => {
    const { participantId } = req.params;
    const { status, submittedAt } = req.body;
    const assessmentId = 1;
    const participantIdParsed = Number(participantId);
    const assessmentIdParased = Number(assessmentId);
    let submitAssessmentParticipantId;

    try {
      submitAssessmentParticipantId = await insertToAssessmentSubmissions(
        assessmentIdParased,
        participantIdParsed,
        status,
        submittedAt
      );
    } catch (error) {
      next(error);
      return;
    }
    res.json(
      itemEnvelope({
        assessmentIdParased,
        participantIdParsed,
      })
    );
  }
);

assessmentsDummyRouter.get(
  '/makeFacilitator/:programId/:participantId',
  async (req, res, next) => {
    const { programId, participantId } = req.params;
    // a role ID of 2 corresponds to a Facilitator
    const roleId = 2;
    const programIdParsed = Number(programId);
    const participantIdParsed = Number(participantId);

    let programFacilitatorRowId;
    try {
      programFacilitatorRowId = await insertToProgramParticipants(
        participantIdParsed,
        programIdParsed,
        roleId
      );
    } catch (error) {
      next(error);
      return;
    }
    res.json(
      itemEnvelope({
        participantId: participantIdParsed,
        programId: programIdParsed,
        roleId: roleId,
      })
    );
  }
);
assessmentsDummyRouter.get(
  '/startAssessment/:assessmentId/:participantId',
  async (req, res, next) => {
    let assessment;
    try {
    } catch (error) {
      next(error);
      return;
    }
    res.json();
  }
);

export default assessmentsDummyRouter;
