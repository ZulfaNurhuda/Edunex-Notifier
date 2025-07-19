/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/// Import Schemas
const Exam = require(`../../schemas/examSchema`);

/// Import Handlers
const moduleHandler = require(`./moduleHandler`);

/**
 * This function is a wrapper around the generic moduleHandler for exams.
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options The options for the handler.
 * @returns {Promise<void>}
 * @throws {RogaError}
 */
async function edunexHandlerExam(options) {
    try {
        await moduleHandler(options, Exam, 'exam');
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexHandlerExam;
