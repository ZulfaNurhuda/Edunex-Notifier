/**
 * @fileoverview This file contains the custom error class for the RogaBot.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

/**
 * Custom error class for the RogaBot.
 * @class RogaError
 * @extends {Error}
 */
class RogaError extends Error {
    /**
     * @constructor
     * @param {string} message The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'RogaError';
    }
}

module.exports = RogaError;
