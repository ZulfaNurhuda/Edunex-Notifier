/// Load Package
const moment = require(`moment-timezone`);
moment.locale(`id`);
const mongoose = require(`mongoose`);
const chalk = require("chalk");

/// Load Module
const RogaClient = require(`../../Structure/RogaClient`);
const DataTugas = require(`../../Schema/dataTugasSchema`);
const edunexRequest = require(`../../Utility/edunexRequest`);
const getQuotes = require(`../../Utility/getQuotes`);
const sendEmail = require(`../../Utility/sendEmail`);
const sendMessageTelegram = require(`../../Utility/sendMessageTelegram`);

/**
 * **Edunex Handler Assignment Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Handler Yang Digunakan Untuk Mengelola Data Assignment Dari Edunex Learning Management System Milik Institut Teknologi Bandung Untuk Dikirim Ke Plaform Terkait
 * ```
 * @param {Object} options Opsi Untuk Edunex Handler Assignment
 * @param {String} options.bearer Bearer Untuk Auth Edunex API
 * @param {Object} options.todo Objek Data Edunex Todo
 * @param {RogaClient} options.client Objek RogaClient
 * @returns {Promise<void>} `Promise<void>` — Edunex Handler Assignment Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
async function edunexHandlerAssignment(options) {
    for (let i in options.todo.tasks) {
        let data = await DataTugas.findOne({
            main: JSON.stringify(options.todo.tasks[i]),
        });

        if (!data) {
            let quote = await getQuotes().catch((e) => {
                throw new Error(e);
            });

            let assignment;
            try {
                assignment = await edunexRequest({
                    bearer: options.bearer,
                    path: `/course/tasks/${options.todo.tasks[i].id}`,
                });
            } catch (e) {
                throw new Error(e);
            }

            if (options.client.sendTo.email) {
                sendEmail(options.client, `assignment`, {
                    id: assignment.data.id,
                    nama_dosen: assignment.data.attributes.created_by,
                    mata_kuliah: `${options.todo.tasks[i].course} (${options.todo.tasks[i].code})`,
                    nama_tugas: assignment.data.attributes.name,
                    deadline: moment(assignment.data.attributes.end_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    tanggal_upload: moment(Date.now())
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    quotes: `"${quote.quote}" (${quote.author})`,
                    url_edunex: `https://edunex.itb.ac.id/assignment/take/${options.todo.tasks[i].id}`,
                })
                    .then((i) =>
                        console.log(
                            chalk.bgGreen(
                                ` V | Email Berhasil Terkirim (${i.messageId})`
                            )
                        )
                    )
                    .catch((e) => {
                        throw new Error(e);
                    });
            }
            if (options.client.sendTo.telegram) {
                if (!options.client.TelegramClient) {
                    throw new Error(
                        `Tidak Bisa Terhubung Dengan Telegram, Periksa Kembali Token Telegram!`
                    );
                }
                sendMessageTelegram(options.client, `assignment`, {
                    nama_dosen: assignment.data.attributes.created_by,
                    mata_kuliah: `${options.todo.tasks[i].course} (${options.todo.tasks[i].code})`,
                    nama_tugas: assignment.data.attributes.name,
                    deadline: moment(assignment.data.attributes.end_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    quotes: `"${quote.quote}" (${quote.author})`,
                    url_edunex: `https://edunex.itb.ac.id/assignment/take/${options.todo.tasks[i].id}`,
                }).then((i) => {
                    console.log(
                        chalk.bgGreen(
                            ` V | Message Telegram Berhasil Terkirim (${i.message_id}) `
                        )
                    )
                }).catch((e) => {
                    throw new Error(e);
                });
            }
            if (options.client.sendTo.discord) {
                if (!options.client.DiscordClient) {
                    throw new Error(
                        `Tidak Bisa Terhubung Dengan Telegram, Periksa Kembali Token Telegram!`
                    );
                }
            }

            const dataTugas = new DataTugas({
                _id: new mongoose.Types.ObjectId(),
                main: JSON.stringify(options.todo.tasks[i]),
            });
            dataTugas.save().catch((e) => {
                throw new Error(e);
            });
        }
    }
}

module.exports = edunexHandlerAssignment;
