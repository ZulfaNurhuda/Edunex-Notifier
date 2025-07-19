/**
 * @fileoverview This file contains the universal error handler.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

const chalk = require('chalk');

/**
 * This function is the universal error handler. It is called whenever an error occurs in the application.
 *
 * @param {Error} error The error that occurred.
 */
function universalError(error) {
    console.error(chalk.bgRed.whiteBright(' An error occurred: '), error);
}

module.exports = universalError;
