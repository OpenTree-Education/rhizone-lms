import { Answer, AssessmentDetails, AssessmentResponse, AssessmentSubmission, CurriculumAssessment, FacilitatorAssessmentSubmissionsSummary, ParticipantAssessmentSubmissionsSummary, ProgramAssessment, Question } from '../models';

// Helper functions

/**
 * Calculates the total number of participants in a program that have started or completed *any* submission for a given program assessment.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<number>} The number of program participants with one or more submissions for that program assessment.
 */
const calculateNumParticipantsWithSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

/**
 * Calculates the total number of participants enrolled in a program, excluding any program facilitators.
 *
 * @param {number} programId - The row ID of the programs table for a given program.
 * @returns {Promise<number>} The number of program participants in that program.
 */
const calculateNumProgramParticipants = async (programId: number): Promise<number> => { return; };

/**
 * Calculates the total number of assessment submissions that have yet to be graded for a given program assessment.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<number>} The number of assessment submissions that have been submitted but not graded.
 */
const calculateNumUngradedSubmissions = async (programAssessmentId: number): Promise<number> => { return; };

/**
 * Inserts a question for an existing curriculum assessment into the assessment_questions table.
 *
 * @param {number} curriculumAssessmentId - The curriculum assessment to which we are adding this question.
 * @param {Question} question - An object containing the question, its metadata, and any possible answers.
 * @returns {Promise<Question>} The updated Question object that was handed to us but with updated row IDs for the question and all answers given to us.
 */
const createAssessmentQuestion = async (curriculumAssessmentId: number, question: Question): Promise<Question> => { return; };

/**
 * Inserts an answer for an existing curriculum assessment question into the assessment_answers table.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for a given question.
 * @param {Answer} answer - An object containing an answer option and its metadata.
 * @returns {Promise<Answer>} The updated Answer object that was handed to us but with row ID specified.
 */
const createAssessmentQuestionAnswer = async (questionId: number, answer: Answer): Promise<Answer> => { return; };

/**
 * Inserts a response for a user for a given curriculum assessment question into the assessment_responses table.
 *
 * @param {AssessmentResponse} assessmentResponse - An object containing the assessment response data.
 * @returns {Promise<AssessmentResponse>} The updated AssessmentResponse object that was handed to us but with row ID specified.
 */
const createSubmissionResponse = async (assessmentResponse: AssessmentResponse): Promise<AssessmentResponse> => { return; };

/**
 * Removes an existing question from a curriculum assessment without deleting the entire assessment.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for a given question.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
const deleteAssessmentQuestion = async (questionId: number): Promise<void> => { return; };

/**
 * Removes an existing answer option from a curriculum assessment question without deleting the question.
 *
 * @param {number} answerId - The row ID of the assessment_answers table for a given answer.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
const deleteAssessmentQuestionAnswer = async (answerId: number): Promise<void> => { return; };

/**
 * Lists all possible answer options for a given curriculum assessment question. If specified, will also return metadata indicating which answer option is correct.
 *
 * @param {number} questionId - The row ID of the assessment_questions table for a given question.
 * @param {boolean} [correctAnswersIncluded] - Optional specifier to determine whether or not the correct answer information should be included or removed from the return value.
 * @returns {Promise<Answer[]>} An array of Answer options, including or omitting the correct answer metadata as specified.
 */
const listAssessmentQuestionAnswers = async (questionId: number, correctAnswersIncluded?: boolean): Promise<Answer[]> => { return []; };

/**
 * Lists all questions of a given curriculum assessment. Based on specified boolean parameter, will also return metadata indicating the correct answer option. Note that for free response questions, this function will not return any answers unless correctAnswersIncluded is set to true.
 *
 * @param {number} curriculumAssessmentId - The row ID of the curriculum_assessments table for a given program assessment.
 * @param {boolean} [correctAnswersIncluded] - Optional specifier to determine whether or not the correct answer information should be included or removed from the return value.
 * @returns {Promise<Question[]>} An array of Question objects, including or omitting the correct answer metadata as specified.
 */
const listAssessmentQuestions = async (curriculumAssessmentId: number, correctAnswersIncluded?: boolean): Promise<Question[]> => { return []; };

/**
 * Lists all responses from a given assessment submission by a program participant. Based on specified boolean parameter, will also include the score and any grader response as well.
 *
 * @param {number} submissionId - The row ID of the assessment_submissions table for a given program assessment.
 * @param {boolean} [gradingsIncluded] - Optional specifier to determine whether or not the grading information (score, grader response) should be included or removed from the return value.
 * @returns {Promise<AssessmentResponse[]>} An array of AssessmentResponse objects, including or omitting the grading information as specified.
 */
const listSubmissionResponses = async (submissionId: number): Promise<AssessmentResponse[]> => { return []; };

/**
 * Updates an existing curriculum assessment question with new answer options or new metadata.
 *
 * @param {Question} question - The Question object for a given curriculum assessment question with updated information.
 * @returns {Promise<Question>} The updated Question object, including created or updated Answer objects, if any.
 */
const updateAssessmentQuestion = async (question: Question): Promise<Question> => { return; };

/**
 * Updates an existing answer option for a curriculum assessment question with new metadata.
 *
 * @param {Answer} answer - The Answer object for a given curriculum assessment question answer option with updated information.
 * @returns {Promise<Answer>} The updated Answer object.
 */
const updateAssessmentQuestionAnswer = async (answer: Answer): Promise<Answer> => { return; };

/**
 * Updates an existing assessment submission response with updated metadata.
 *
 * @param {AssessmentResponse} assessmentResponse - The AssessmentResponse object for a given program assessment submission response with updated information.
 * @returns {Promise<AssessmentResponse>} The updated AssessmentResponse object.
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
 * @param {boolean} [gradesIncluded] -
 * @returns {Promise<AssessmentSubmission | null>}
 */
export const getAssessmentSubmission = async (assessmentSubmissionId: number, responsesIncluded?: boolean, gradesIncluded?: boolean): Promise<AssessmentSubmission | null> => { return; };

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
