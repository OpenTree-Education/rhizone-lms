import { Answer, AssessmentResponse, AssessmentSubmission, CurriculumAssessment, FacilitatorAssessmentSubmissionsSummary, ParticipantAssessmentSubmissionsSummary, ProgramAssessment, Question } from '../models';

// Helper functions

/**
 * Determines whether or not a specific program assessment submission has expired and is no longer allowed to be updated by the participant.
 * 
 * @param assessmentSubmissionId - The row ID of the assessment_submissions table for a given program assessment submission.
 * @returns {Promise<boolean>} If true, a participant should be prevented from submitting any updates to their program assessment submission, other than to mark it as "Expired" instead of "Opened" or "In Progress".
 */
const assessmentSubmissionExpired = async (assessmentSubmissionId: number): Promise<boolean> => { return; }

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
 * @param {number} curriculumAssessmentId - The row ID of the curriculum_assessments table for a given curriculum assessment.
 * @param {boolean} [correctAnswersIncluded] - Optional specifier to determine whether or not the correct answer information should be included or removed from the return value.
 * @returns {Promise<Question[]>} An array of Question objects, including or omitting the correct answer metadata as specified.
 */
const listAssessmentQuestions = async (curriculumAssessmentId: number, correctAnswersIncluded?: boolean): Promise<Question[]> => { return []; };

/**
 * Lists all responses from a given assessment submission by a program participant. Based on specified boolean parameter, will also include the score and any grader response as well.
 *
 * @param {number} submissionId - The row ID of the assessment_submissions table for a given program assessment submission.
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
 * Gathers the relevant information for constructing a FacilitatorAssessmentSubmissionsSummary for a given program assessment.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<FacilitatorAssessmentSubmissionsSummary>} The program assessment submissions summary information for use by a program facilitator.
 */
export const constructFacilitatorAssessmentSummary = async (programAssessmentId: number): Promise<FacilitatorAssessmentSubmissionsSummary> => { return; };

/**
 * Gathers the relevant information for constructing a ParticipantAssessmentSubmissionsSummary for a given participant principal ID and a given program assessment.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table that corresponds with a given program participant.
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<ParticipantAssessmentSubmissionsSummary>} The program assessment submissions summary information for use by a program participant.
 */
export const constructParticipantAssessmentSummary = async (participantPrincipalId: number, programAssessmentId: number): Promise<ParticipantAssessmentSubmissionsSummary> => { return; };

/**
 * Begins a new program assessment submission for a program participant, if they have not exceeded the maximum number of allowed submissions for that assessment and no other assessment submissions are in progress by that program participant for that program assessment.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table that corresponds with a given program participant.
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<AssessmentSubmission>} An AssessmentSubmission object constructed from the inserted row in the assessment_submissions table.
 */
export const createAssessmentSubmission = async (participantPrincipalId: number, programAssessmentId: number): Promise<AssessmentSubmission> => { return; };

/**
 * Creates a new curriculum assessment in the curriculum_assessments table, linked with a given curriculum activity.
 *
 * @param {CurriculumAssessment} curriculumAssessment - The CurriculumAssessment object for the new curriculum assessment data to be inserted.
 * @returns {Promise<CurriculumAssessment>} The updated CurriculumAssessment object that was handed to us, but with row ID specified.
 */
export const createCurriculumAssessment = async (curriculumAssessment: CurriculumAssessment): Promise<CurriculumAssessment> => { return; };

/**
 * Creates a new program assessment in the program_assessments table, linked with a given curriculum assessment.
 *
 * @param {ProgramAssessment} programAssessment - The ProgramAssessment object for the new program assessment data to be inserted.
 * @returns {Promise<ProgramAssessment>} The updated ProgramAssessment object that was handed to us, but with row ID specified.
 */
export const createProgramAssessment = async (programAssessment: ProgramAssessment): Promise<ProgramAssessment> => { return; };

/**
 * Deletes a given curriculum assessment, all associated program assessments, and all associated questions and answers for a given curriculum assessment. This function fails to execute if there has ever been an assessment submission for the questions and answers in this curriculum assessment.
 *
 * @param {number} curriculumAssessmentId - The row ID of the curriculum_assessments table for a given curriculum assessment.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
export const deleteCurriculumAssessment = async (curriculumAssessmentId: number): Promise<void> => { return; };

/**
 * Deletes a given program assessment, but leaves the curriculum assessment, its questions, and its answers intact. This function fails to execute if there has ever been an assessment submission for this program assessment by a program participant.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<void>} Returns nothing if the deletion was successful.
 */
export const deleteProgramAssessment = async (programAssessmentId: number): Promise<void> => { return; };

/**
 * Finds a single program assessment by its row ID, if it exists in the program_assessments table.
 *
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<ProgramAssessment>} The ProgramAssessment representation of that program assessment, or null if no matching program assessment was found.
 */
export const findProgramAssessment = async (programAssessmentId: number): Promise<ProgramAssessment> => { return; };

/**
 * Finds a single program assessment submission by its row ID, if it exists in the assessment_submissions table. Optionally returns the submission's saved responses and the grading information for the submission and its responses.
 *
 * @param {number} assessmentSubmissionId - The row ID of the assessment_submissions table for a given program assessment submission.
 * @param {boolean} [responsesIncluded] - Optional specifier to determine whether or not the assessment responses will be included in the returned object.
 * @param {boolean} [gradesIncluded] - Optional specifier to override the default grading information return behavior, such as if a program facilitator was retrieving the assessment submission. If this parameter is not specified, the default behavior will take over: the grading information will only be released if the assessment submission is in the "Graded" state.
 * @returns {Promise<AssessmentSubmission>} The AssessmentSubmission representation of that program assessment submission, or null if no matching program assessment submission was found.
 */
export const getAssessmentSubmission = async (assessmentSubmissionId: number, responsesIncluded?: boolean, gradesIncluded?: boolean): Promise<AssessmentSubmission> => { return; };

/**
 * Finds a single curriculum assessment by its row ID, if it exists in the curriculum_assessments table. Optionally returns the questions and all answer options, such as when a participant is creating or viewing an assessment submission, and the questions and correct answers, such as when a participant is viewing a graded submission or a facilitator is grading a submission.
 *
 * @param {number} curriculumAssessmentId - The row ID of the curriculum_assessments table for a given curriculum assessment.
 * @param {boolean} [questionsAndAllAnswersIncluded] - Optional specifier to determine whether or not the questions and all answer options will be included in the returned object.
 * @param {boolean} [questionsAndCorrectAnswersIncluded] - Optional specifier to determine whether or not the correct answer information for the curriculum assessment questions will be included in the returned object.
 * @returns {Promise<CurriculumAssessment>} The CurriculumAssessment representation of that curriculum assessment, or null if no matching curriculum assessment was found.
 */
export const getCurriculumAssessment = async (curriculumAssessmentId: number, questionsAndAllAnswersIncluded?: boolean, questionsAndCorrectAnswersIncluded?: boolean): Promise<CurriculumAssessment> => { return; };

/**
 * Retrieves the string representation of a principal's role for a given program: "Facilitator" for a program facilitator, "Participant" for a program participant, or null if not enrolled in the specified program.
 *
 * @param {number} principalId - The row ID of the principals table that corresponds with a given program member.
 * @param {number} programId - The row ID of the programs table for a given program.
 * @returns {Promise<string>} The string value of a principal's role in a given program, or null if they are not enrolled as a participant or facilitating that program.
 */
export const getPrincipalProgramRole = async (principalId: number, programId: number): Promise<string> => { return; };

/**
 * Lists all submissions by a program participant for a given program assessment, if any. Does not include responses for those submissions.
 *
 * @param {number} participantPrincipalId - The row ID of the principals table that corresponds with a given program participant.
 * @param {number} programAssessmentId - The row ID of the program_assessments table for a given program assessment.
 * @returns {Promise<AssessmentSubmission[]>} An array of AssessmentSubmission objects constructed from matching program assessment submissions, if any, not including their responses.
 */
export const listParticipantProgramAssessmentSubmissions = async (participantPrincipalId: number, programAssessmentId: number): Promise<AssessmentSubmission[]> => { return []; };

/**
 * Lists all row IDs of programs for which a principal is either enrolled as a participant or is designated as facilitator.
 *
 * @param {number} principalId - The row ID of the principals table that corresponds with a given program member.
 * @returns {Promise<number[]>} An array of row IDs for all matching programs for which the user is enrolled or is facilitating.
 */
export const listPrincipalEnrolledProgramIds = async (principalId: number): Promise<number[]> => { return []; };

/**
 * Lists all available program assessments for a given program.
 *
 * @param {number} programId - The row ID of the programs table for a given program.
 * @returns {Promise<ProgramAssessment[]>} An array of the ProgramAssessment objects constructed from matching program assessments, if any.
 */
export const listProgramAssessments = async (programId: number): Promise<ProgramAssessment[]> => { return []; };

/**
 * Updates a program assessment submission for a program participant, if their time has not expired, or updates a program assessment submission by the facilitator, if optional parameter passed is true. If the submission is expired and the function is not passed true for facilitatorOverride, the only update allowed will be to mark a program assessment submission "Expired" instead of "Opened" or "In Progress".
 *
 * @param {AssessmentSubmission} assessmentSubmission - The updated program assessment submission information, including responses.
 * @param {boolean} [facilitatorOverride] - Optional specifier for when the program facilitator is the one updating a program assessment submission, skipping the submission expiration check.
 * @returns {Promise<AssessmentSubmission>} An AssessmentSubmission object constructed from the updated row in the assessment_submissions table.
 */
export const updateAssessmentSubmission = async (assessmentSubmission: AssessmentSubmission, facilitatorOverride?: boolean): Promise<AssessmentSubmission> => { return; };

/**
 * Updates an existing curriculum assessment, its metadata, and its associated questions and answers if given.
 *
 * @param {CurriculumAssessment} curriculumAssessment - The updated curriculum assessment information with which to update the corresponding database data.
 * @returns {Promise<CurriculumAssessment>} The updated CurriculumAssessment object that was handed to us, if update was successful.
 */
export const updateCurriculumAssessment = async (curriculumAssessment: CurriculumAssessment): Promise<CurriculumAssessment> => { return; };

/**
 * Updates an existing program assessment in the program_assessments table.
 *
 * @param {ProgramAssessment} programAssessment - The updated program assessment information with which to update the corresponding database data.
 * @returns {Promise<ProgramAssessment>} The updated ProgramAssessment object that was handed to us, if update was successful.
 */
export const updateProgramAssessment = async (programAssessment: CurriculumAssessment): Promise<ProgramAssessment> => { return; };
