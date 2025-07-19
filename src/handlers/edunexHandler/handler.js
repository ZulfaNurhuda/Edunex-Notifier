/**
 * @fileoverview This file contains the handler for the Edunex API.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

/// Import Packages
const chalk = require(`chalk`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/// Import Handlers
const handlerAssignment = require(`./handlerAssignment`);
const handlerExam = require(`./handlerExam`);

/// Import Utils
const edunexRequest = require(`../../utils/edunexRequest`);

/**
 * This function handles the Edunex API requests. It fetches the "todo" data from the Edunex API and then calls the appropriate handlers for assignments and exams.
 *
 * @param {RogaTypes.EdunexHandlerOptions} options The options for the handler.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while handling the Edunex API requests.
 */
async function edunexHandler(options) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, bearer } = options;

    if (!bearer || typeof bearer !== `string` || !bearer.trim()) {
        throw new RogaError(
            `Bearer token tidak valid. Harus berupa string yang tidak kosong.`
        );
    }

    if (!client || !(client instanceof RogaClient)) {
        throw new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (!client.isActive) return;

    try {
        const todo = await edunexRequest({ path: `/todo`, bearer });

        if (todo.tasks && todo.tasks.length > 0) {
            await handlerAssignment({ bearer, todo, client });
            console.log(
                chalk.bgGreen.whiteBright(
                    ` ✔️ | Pengelolaan data assignment sedang berlangsung. [${new Date()}] `
                )
            );
        }

        if (todo.exams && todo.exams.length > 0) {
            await handlerExam({ bearer, todo, client });
            console.log(
                chalk.bgGreen.whiteBright(
                    ` ✔️ | Pengelolaan data exam sedang berlangsung. [${new Date()}] `
                )
            );
        }
    } catch (error) {
        client.setStatus(`inactive`);
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexHandler;
