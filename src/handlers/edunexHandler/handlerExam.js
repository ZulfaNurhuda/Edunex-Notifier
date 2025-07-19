/**
 * @fileoverview This file contains the handler for Edunex exams.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/// Import Schemas
const Exam = require(`../../schemas/examSchema`);

/// Import Handlers
const moduleHandler = require(`./moduleHandler`);

/**
 * This function is a wrapper around the generic moduleHandler for exams. It calls the moduleHandler with the appropriate parameters for exams.
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options The options for the handler.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while handling the exam.
 */
async function edunexHandlerExam(options) {
    try {
        await moduleHandler(options, Exam, 'exam');
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexHandlerExam;
