import { Answer, AssessmentDetails, AssessmentResponse, AssessmentSubmission, CurriculumAssessment, FacilitatorAssessmentSubmissionsSummary, ParticipantAssessmentSubmissionsSummary, ProgramAssessment, Question } from '../models';

// Helper functions

/**
 *
 *
 * @param {number} programAssessmentId -
 * @returns {Promise<number>}
 */
const calculateNumParticipantsWithSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

/**
 *
 *
 * @param {number} programId -
 * @returns {Promise<number>}
 */
const calculateNumProgramParticipants = async (programId: number): Promise<number> => { return; };

/**
 *
 *
 * @param {number} programAssessmentId -
 * @returns {Promise<number>}
 */
const calculateNumUngradedSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

/**
 *
 *
 * @param {number} curriculumAssessmentId -
 * @param {Question} question -
 * @returns {Promise<Question>}
 */
const createAssessmentQuestion = async (curriculumAssessmentId: number, question: Question): Promise<Question> => { return; };

/**
 *
 *
 * @param {number} questionId -
 * @param {Answer} answer -
 * @returns {Promise<Answer>}
 */
const createAssessmentQuestionAnswer = async (questionId: number, answer: Answer): Promise<Answer> => { return; };

/**
 *
 *
 * @param {AssessmentResponse} assessmentResponse -
 * @returns {Promise<AssessmentResponse>}
 */
const createSubmissionResponse = async (assessmentResponse: AssessmentResponse): Promise<AssessmentResponse> => { return; };

/**
 *
 *
 * @param {number} questionId -
 * @returns {Promise<void>}
 */
const deleteAssessmentQuestion = async (questionId: number): Promise<void> => { return; };

/**
 *
 *
 * @param {number} answerId -
 * @returns {Promise<void>}
 */
const deleteAssessmentQuestionAnswer = async (answerId: number): Promise<void> => { return; };

/**
 *
 *
 * @param {number} questionId -
 * @param {boolean} [correctAnswersIncluded] -
 * @returns {Promise<Answer[]>}
 */
const listAssessmentQuestionAnswers = async (questionId: number, correctAnswersIncluded?: boolean): Promise<Answer[]> => { return []; };

/**
 *
 *
 * @param {number} programAssessmentId -
 * @param {boolean} [allAnswersIncluded] -
 * @param {boolean} [correctAnswersIncluded] -
 * @returns {Promise<Question[]>}
 */
const listAssessmentQuestions = async (programAssessmentId: number, allAnswersIncluded?: boolean, correctAnswersIncluded?: boolean): Promise<Question[]> => { return []; };

/**
 *
 *
 * @param {number} submissionId -
 * @returns {Promise<AssessmentResponse[]>}
 */
const listSubmissionResponses = async (submissionId: number): Promise<AssessmentResponse[]> => { return []; };

/**
 *
 *
 * @param {Question} question -
 * @returns {Promise<Question>}
 */
const updateAssessmentQuestion = async (question: Question): Promise<Question> => { return; };

/**
 *
 *
 * @param {Answer} answer -
 * @returns {Promise<Answer>}
 */
const updateAssessmentQuestionAnswer = async (answer: Answer): Promise<Answer> => { return; };

/**
 *
 *
 * @param {AssessmentResponse} assessmentResponse -
 * @returns {Promise<AssessmentResponse>}
 */
const updateSubmissionResponse = async (assessmentResponse: AssessmentResponse): Promise<AssessmentResponse> => { return; };


// Callable from router

/**
 *
 *
 * @param {number} programAssessmentId -
 * @returns {Promise<FacilitatorAssessmentSubmissionsSummary>}
 */
export const constructFacilitatorAssessmentSummary = async (programAssessmentId: number): Promise<FacilitatorAssessmentSubmissionsSummary> => { return; };

/**
 *
 *
 * @param {number} participantPrincipalId -
 * @param {number} programAssessmentId -
 * @returns {Promise<ParticipantAssessmentSubmissionsSummary>}
 */
export const constructParticipantAssessmentSummary = async (participantPrincipalId: number, programAssessmentId: number): Promise<ParticipantAssessmentSubmissionsSummary> => { return; };

/**
 *
 *
 * @param {AssessmentDetails} assessmentDetails -
 * @returns {Promise<AssessmentDetails>}
 */
export const createAssessment = async (assessmentDetails: AssessmentDetails): Promise<AssessmentDetails> => { return; };

/**
 *
 *
 * @param {AssessmentSubmission} assessmentSubmission -
 * @returns {Promise<AssessmentSubmission>}
 */
export const createAssessmentSubmission = async (assessmentSubmission: AssessmentSubmission): Promise<AssessmentSubmission> => { return; };

/**
 *
 *
 * @param {number} curriculumAssessmentId -
 * @returns {Promise<void>}
 */
export const deleteCurriculumAssessment = async (curriculumAssessmentId: number): Promise<void> => { return; };

/**
 *
 *
 * @param {number} programAssessmentId -
 * @returns {Promise<void>}
 */
export const deleteProgramAssessment = async (programAssessmentId: number): Promise<void> => { return; };

/**
 *
 *
 * @param {number} programAssessmentId -
 * @returns {Promise<ProgramAssessment | null>}
 */
export const findProgramAssessment = async (programAssessmentId: number): Promise<ProgramAssessment | null> => { return; };

/**
 *
 *
 * @param {number} assessmentSubmissionId -
 * @param {boolean} [responsesIncluded] -
 * @returns {Promise<AssessmentSubmission | null>}
 */
export const getAssessmentSubmission = async (assessmentSubmissionId: number, responsesIncluded?: boolean): Promise<AssessmentSubmission | null> => { return; };

/**
 *
 *
 * @param {number} curriculumAssessmentId -
 * @param {boolean} [questionsAndAllAnswersIncluded] -
 * @param {boolean} [questionsAndCorrectAnswersIncluded] -
 * @returns {Promise<CurriculumAssessment | null>}
 */
export const getCurriculumAssessment = async (curriculumAssessmentId: number, questionsAndAllAnswersIncluded?: boolean,  questionsAndCorrectAnswersIncluded?: boolean): Promise<CurriculumAssessment | null> => { return; };

/**
 *
 *
 * @param {number} principalId -
 * @param {number} programId -
 * @returns {Promise<string | null>}
 */
export const getPrincipalProgramRole = async (principalId: number, programId: number): Promise<string | null> => { return null; };

/**
 *
 *
 * @param {number} participantPrincipalId -
 * @param {number} programAssessmentId -
 * @returns {Promise<AssessmentSubmission[]>}
 */
export const listParticipantProgramAssessmentSubmissions = async (participantPrincipalId: number, programAssessmentId: number): Promise<AssessmentSubmission[]> => { return []; };

/**
 *
 *
 * @param {number} principalId -
 * @returns {Promise<number[]>}
 */
export const listPrincipalEnrolledProgramIds = async (principalId: number): Promise<number[]> => { return []; };

/**
 *
 *
 * @param {number} programId -
 * @returns {Promise<ProgramAssessment[]>}
 */
export const listProgramAssessments = async (programId: number): Promise<ProgramAssessment[]> => { return []; };

/**
 *
 *
 * @param {AssessmentDetails} assessmentDetails -
 * @returns {Promise<AssessmentDetails>}
 */
export const updateAssessment = async (assessmentDetails: AssessmentDetails): Promise<AssessmentDetails> => { return; };

/**
 *
 *
 * @param {AssessmentSubmission} assessmentSubmission -
 * @returns {Promise<AssessmentSubmission>}
 */
export const updateAssessmentSubmission = async (assessmentSubmission: AssessmentSubmission): Promise<AssessmentSubmission> => { return; };
