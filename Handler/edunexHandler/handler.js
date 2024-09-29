/// Load Module
const RogaClient = require(`../../Structure/RogaClient`);
const edunexRequest = require(`../../Utility/edunexRequest`);
const handlerAssignment = require(`./handlerAssignment`);
const handlerExam = require(`./handlerExam`);

/**
 * **Edunex Handler Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Handler Yang Digunakan Untuk Terhubung Dengan Edunex Learning Management System Milik Institut Teknologi Bandung
 * ```
 * @param {Object} options Opsi Untuk Edunex Handler
 * @param {String} options.bearer Bearer Untuk Auth Edunex API
 * @param {RogaClient} options.client Objek RogaClient
 * @returns {Promise<void>} `Promise<void>` — Edunex Handler Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
async function edunexHandler(options) {
    edunexRequest({ path: `/todo`, bearer: options.bearer }).then((todo) => {
        if (todo.tasks.length > 0) {
            handlerAssignment({
                bearer: options.bearer,
                todo: todo,
                client: options.client,
            });
        }

        if (todo.exams.length > 0) {
            handlerExam({
                bearer: options.bearer,
                todo: todo,
                client: options.client,
            });
        }
    });
}

module.exports = edunexHandler;
