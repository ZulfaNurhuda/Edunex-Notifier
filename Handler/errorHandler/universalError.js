/// Load Package
const chalk = require(`chalk`);

/**
 * **Error Handler Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Handler Yang Digunakan Untuk Mengelola Error Yang Terjadi
 * ```
 * @param {Error} e Error Object
 * @returns {void} `void` — Error Handler Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
function errorHandler(e) {
    console.log(chalk.bgRed.bold.white(` X | ERROR TERJADI! `));
    console.error(e.stack);
}

module.exports = errorHandler;
