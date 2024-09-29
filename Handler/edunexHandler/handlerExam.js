/// Load Package
const moment = require(`moment-timezone`);
moment.locale(`id`);
const mongoose = require(`mongoose`);
const chalk = require("chalk");

/// Load Module
const RogaClient = require(`../../Structure/RogaClient`);
const DataUjian = require(`../../Schema/dataUjianSchema`);
const edunexRequest = require(`../../Utility/edunexRequest`);
const getQuotes = require(`../../Utility/getQuotes`);
const sendEmail = require(`../../Utility/sendEmail`);
const sendMessageTelegram = require(`../../Utility/sendMessageTelegram`);

/**
 * **Edunex Handler Exam Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Handler Yang Digunakan Untuk Mengelola Data Exam Dari Edunex Learning Management System Milik Institut Teknologi Bandung Untuk Dikirim Ke Plaform Terkait
 * ```
 * @param {Object} options Opsi Untuk Edunex Handler Exam
 * @param {String} options.bearer Bearer Untuk Auth Edunex API
 * @param {Object} options.todo Objek Data Edunex Todo
 * @param {RogaClient} options.client Objek RogaClient
 * @returns {Promise<void>} `Promise<void>` — Edunex Handler Exam Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
async function edunexHandlerExam(options) {
    for (let i in options.todo.exams) {
        let data = await DataUjian.findOne({
            main: JSON.stringify(options.todo.exams[i]),
        });

        if (!data) {
            let quote = await getQuotes().catch((e) => {
                throw new Error(e);
            });

            let exam;
            try {
                exam = await edunexRequest({
                    bearer: options.bearer,
                    path: `/exam/exams/${options.todo.exams[i].id}`,
                });
            } catch (e) {
                throw new Error(e);
            }

            let lecturer;
            try {
                lecturer = await edunexRequest({
                    bearer: options.bearer,
                    path: `/stats/user/${exam.data.attributes.created_by}`,
                });
            } catch (e) {
                throw new Error(e);
            }

            if (options.client.sendTo.email) {
                sendEmail(options.client, `exam`, {
                    id: exam.data.id,
                    nama_dosen: lecturer.user.name,
                    mata_kuliah: `${options.todo.exams[i].course} (${options.todo.exams[i].code})`,
                    nama_exam: exam.data.attributes.name,
                    tanggal_mulai: moment(exam.data.attributes.start_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    deadline: moment(exam.data.attributes.end_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    tanggal_upload: moment(exam.data.attributes.created_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    durasi: `${exam.data.attributes.duration} Menit`,
                    kesempatan: exam.data.attributes.retry,
                    can_back:
                        exam.data.attributes.is_back === 1
                            ? `Bisa`
                            : `Tidak Bisa`,
                    quotes: `"${quote.quote}" (${quote.author})`,
                    url_edunex: `https://edunex.itb.ac.id/exam`,
                })
                    .then((i) =>
                        console.log(
                            chalk.bgGreen(
                                ` V | Email Berhasil Terkirim Ke ${i.messageId} `
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
                sendMessageTelegram(options.client, `exam`, {
                    nama_dosen: lecturer.user.name,
                    mata_kuliah: `${options.todo.exams[i].course} (${options.todo.exams[i].code})`,
                    nama_exam: exam.data.attributes.name,
                    tanggal_mulai: moment(exam.data.attributes.start_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    deadline: moment(exam.data.attributes.end_at)
                        .tz("Asia/Jakarta")
                        .format("LLLL"),
                    durasi: `${exam.data.attributes.duration} Menit`,
                    kesempatan: exam.data.attributes.retry,
                    can_back:
                        exam.data.attributes.is_back === 1
                            ? `Bisa`
                            : `Tidak Bisa`,
                    quotes: `"${quote.quote}" (${quote.author})`,
                    url_edunex: `https://edunex.itb.ac.id/exam`,
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

            const dataUjian = new DataUjian({
                _id: new mongoose.Types.ObjectId(),
                main: JSON.stringify(options.todo.exams[i]),
            });
            dataUjian.save().catch((e) => {
                throw new Error(e);
            });
        }
    }
}

module.exports = edunexHandlerExam;
