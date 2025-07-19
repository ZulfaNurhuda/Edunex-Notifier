/**
 * @fileoverview This file contains the graceful shutdown handler.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

const chalk = require('chalk');

/**
 * This function handles the graceful shutdown of the application. It is called when the process receives a termination signal.
 *
 * @param {RogaClient} Roga The RogaClient instance.
 */
function gracefulShutdown(Roga) {
    console.log(chalk.bgRed.whiteBright(' Gracefully shutting down... '));
    Roga.setStatus('inactive');
    process.exit(0);
}

module.exports = gracefulShutdown;
