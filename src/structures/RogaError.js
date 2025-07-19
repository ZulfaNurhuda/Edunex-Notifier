/**
 * @fileoverview This file contains the custom error class for the RogaBot.
 * @version 3.0.0
 * @author Zulfa Nurhuda
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
