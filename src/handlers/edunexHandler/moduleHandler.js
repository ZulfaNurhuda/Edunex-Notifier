/// Import Packages
const moment = require(`moment-timezone`);
const mongoose = require(`mongoose`);
moment.locale(`id`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/// Import Utils
const edunexRequest = require(`../../utils/edunexRequest`);

/// Import Services
const sendData = require(`../../services/platformSendMessage/send`);

/**
 * A generic handler for Edunex modules (assignments and exams).
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options The options for the handler.
 * @param {mongoose.Model} model The Mongoose model to use.
 * @param {string} moduleType The type of the module (e.g., "assignment", "exam").
 * @returns {Promise<void>}
 * @throws {RogaError}
 */
async function moduleHandler(options, model, moduleType) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { bearer, todo, client } = options;

    if (!bearer || typeof bearer !== `string` || !bearer.trim()) {
        throw new RogaError(
            `Bearer token tidak valid. Harus berupa string yang tidak kosong.`
        );
    }

    if (!todo || typeof todo !== `object`) {
        throw new RogaError(`Objek todo tidak valid. Harus berupa object.`);
    }

    if (!client || !(client instanceof RogaClient)) {
        throw new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    const modules = moduleType === 'assignment' ? todo.tasks : todo.exams;

    for (const module of modules) {
        try {
            const existingModule = await model.findOne({ [`${moduleType}Id`]: module.id });

            const moduleData = await edunexRequest({
                bearer,
                path: moduleType === 'assignment' ? `/course/tasks/${module.id}` : `/exam/exams/${module.id}`,
            });

            if (!existingModule) {
                let message;
                if (moduleType === 'assignment') {
                    message = {
                        nama_dosen: moduleData.data.attributes.created_by,
                        mata_kuliah: `${module.course} (${module.code})`,
                        nama: moduleData.data.attributes.name,
                        tanggal_mulai: moment(
                            moduleData.data.attributes.start_at
                        )
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        deadline: moment(moduleData.data.attributes.end_at)
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        tanggal_upload: moment(
                            moduleData.data.attributes.created_at
                        )
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        url_edunex: `https://edunex.itb.ac.id/assignment/take/${module.id}`,
                    };
                } else {
                    const lecturerData = await edunexRequest({
                        bearer,
                        path: `/stats/user/${moduleData.data.attributes.created_by}`,
                    });
                    message = {
                        nama_dosen: lecturerData.user.name,
                        mata_kuliah: `${module.course} (${module.code})`,
                        nama: moduleData.data.attributes.name,
                        tanggal_mulai: moment(moduleData.data.attributes.start_at)
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        deadline: moment(moduleData.data.attributes.end_at)
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        tanggal_upload: moment(moduleData.data.attributes.created_at)
                            .tz(`Asia/Jakarta`)
                            .format(`LLLL`),
                        durasi: `${moduleData.data.attributes.duration} Menit`,
                        kesempatan: moduleData.data.attributes.retry,
                        can_back:
                            moduleData.data.attributes.is_back === 1
                                ? `Bisa`
                                : `Tidak Bisa`,
                        url_edunex: `https://edunex.itb.ac.id/exam/take/${module.id}`,
                    };
                }

                await sendData[`${moduleType}Type`]({ client, message, url_edunex: message.url_edunex });

                const newModule = new model({
                    _id: new mongoose.Types.ObjectId(),
                    [`${moduleType}Id`]: module.id,
                    [`${moduleType}Data`]: JSON.stringify(module),
                });
                await newModule.save();
            } else {
                const dataFromDatabase = existingModule[`${moduleType}Data`];
                const dataFromEdunex = module;

                if (dataFromDatabase === JSON.stringify(dataFromEdunex)) return;

                existingModule[`${moduleType}Data`] = JSON.stringify(module);
                await existingModule.save();
            }
        } catch (error) {
            throw new RogaError(`Error handling ${moduleType} with ID ${module.id}: ${error.message || error}`);
        }
    }
}

module.exports = moduleHandler;
