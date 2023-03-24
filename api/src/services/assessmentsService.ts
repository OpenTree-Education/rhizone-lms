import { Answer, AssessmentDetails, AssessmentResponse, AssessmentSubmission, CurriculumAssessment, FacilitatorAssessmentSubmissionsSummary, ParticipantAssessmentSubmissionsSummary, ProgramAssessment, Question } from '../models';

// Helper functions

const calculateNumParticipantsWithSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

const calculateNumProgramParticipants = async (programId: number): Promise<number> => { return; };

const calculateNumUngradedSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

const createAssessmentQuestion = async (questionId: number, question: Question): Promise<Question> => { return; };

const createAssessmentQuestionAnswer = async (answerId: number, answer: Answer): Promise<Answer> => { return; };

const createAssessmentResponse = async (assessmentResponse: AssessmentResponse): Promise<AssessmentResponse> => { return; };

const deleteAssessmentQuestion = async (questionId: number): Promise<void> => { return; };

const deleteAssessmentQuestionAnswer = async (answerId: number): Promise<void> => { return; };

const listAssessmentQuestionAnswers = async (questionId: number, correctAnswersIncluded?: boolean): Promise<Answer[]> => { return []; };

const listAssessmentQuestions = async (programAssessmentId: number, allAnswersIncluded?: boolean, correctAnswersIncluded?: boolean): Promise<Question[]> => { return []; };

const listAssessmentResponses = async (participantPrincipalId: number, programAssessmentId: number): Promise<AssessmentResponse[]> => { return []; };

const updateAssessmentQuestion = async (questionId: number, question: Question): Promise<Question> => { return; };

const updateAssessmentQuestionAnswer = async (answerId: number, answer: Answer): Promise<Answer> => { return; };

const updateAssessmentResponse = async (assessmentResponse: AssessmentResponse): Promise<AssessmentResponse> => { return; };


// Callable from router

export const constructFacilitatorAssessmentSummary = async (programAssessmentId: number): Promise<FacilitatorAssessmentSubmissionsSummary> => { return; };

export const constructParticipantAssessmentSummary = async (participantPrincipalId: number, programAssessmentId: number): Promise<ParticipantAssessmentSubmissionsSummary> => { return; };

export const createAssessment = async (assessmentDetails: AssessmentDetails): Promise<AssessmentDetails> => { return; };

export const createAssessmentSubmission = async (assessmentSubmission: AssessmentSubmission): Promise<AssessmentSubmission> => { return; };

export const deleteCurriculumAssessment = async (curriculumAssessmentId: number): Promise<void> => { return; };

export const deleteProgramAssessment = async (programAssessmentId: number): Promise<void> => { return; };

export const findProgramAssessment = async (programAssessmentId: number): Promise<ProgramAssessment | null> => { return; };

export const getAssessmentSubmission = async (assessmentSubmissionId: number, responsesIncluded?: boolean): Promise<AssessmentSubmission | null> => { return; };

export const getCurriculumAssessment = async (curriculumAssessmentId: number, questionsAndAllAnswersIncluded?: boolean,  questionsAndCorrectAnswersIncluded?: boolean): Promise<CurriculumAssessment | null> => { return; };

export const getPrincipalProgramRole = async (principalId: number, programId: number): Promise<string | null> => { return null; };

export const listParticipantProgramAssessmentSubmissions = async (participantPrincipalId: number, programAssessmentId: number): Promise<AssessmentSubmission[]> => { return []; };

export const listPrincipalEnrolledProgramIds = async (principalId: number): Promise<number[]> => { return []; };

export const listProgramAssessments = async (programId: number): Promise<ProgramAssessment[]> => { return []; };

export const updateAssessment = async (assessmentDetails: AssessmentDetails): Promise<AssessmentDetails> => { return; };

export const updateAssessmentSubmission = async (assessmentSubmission: AssessmentSubmission): Promise<AssessmentSubmission> => { return; };


