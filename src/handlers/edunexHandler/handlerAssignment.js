/**
 * @fileoverview This file contains the handler for Edunex assignments.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/// Import Schemas
const Assignment = require(`../../schemas/assignmentSchema`);

/// Import Handlers
const moduleHandler = require(`./moduleHandler`);

/**
 * This function is a wrapper around the generic moduleHandler for assignments. It calls the moduleHandler with the appropriate parameters for assignments.
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options The options for the handler.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while handling the assignment.
 */
async function edunexHandlerAssignment(options) {
    try {
        await moduleHandler(options, Assignment, 'assignment');
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexHandlerAssignment;
