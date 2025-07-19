/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/// Import Schemas
const Assignment = require(`../../schemas/assignmentSchema`);

/// Import Handlers
const moduleHandler = require(`./moduleHandler`);

/**
 * This function is a wrapper around the generic moduleHandler for assignments.
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options The options for the handler.
 * @returns {Promise<void>}
 * @throws {RogaError}
 */
async function edunexHandlerAssignment(options) {
    try {
        await moduleHandler(options, Assignment, 'assignment');
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexHandlerAssignment;
