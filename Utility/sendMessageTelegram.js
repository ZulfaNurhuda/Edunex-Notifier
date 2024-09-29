/// Load Package
const fs = require(`fs`);
const TelegramBot = require("node-telegram-bot-api");

/// Load Modules
const RogaClient = require("../Structure/RogaClient");

/**
 * **Replacer Assignment Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Mereplace Variabel Pada Assignment Dengan Data Real
 * ```
 * @param {Object} options Opsi Untuk Replacer Function
 * @param {String} options.nama_dosen Nama Dosen
 * @param {String} options.mata_kuliah Mata Kuliah
 * @param {String} options.nama_tugas Nama Tugas
 * @param {String} options.deadline Deadline Pengerjaan Tugas
 * @param {String} options.quotes Motivational Quotes
 * @returns {String} `String` — Data Message Assignment Untuk Dikirim Ke Telegram
 * @author `ZulfaNurhuda.` — My Developer
 */
function replacerAssignment(options) {
    const data = fs.readFileSync(
        `${process.cwd()}/Template/messageTemplateAssignment.txt`,
        `utf8`
    );
    const dataReplaced = data.replace(
        /(\$\w+)/g,
        (kata) => (kata = options[kata.slice(1)])
    );
    return dataReplaced;
}

/**
 * **Replacer Exam Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Mereplace Variabel Pada Exam Dengan Data Real
 * ```
 * @param {Object} options Opsi Untuk Replacer Function
 * @param {String} options.nama_dosen Nama Dosen
 * @param {String} options.mata_kuliah Mata Kuliah
 * @param {String} options.nama_exam Nama Exam/Quiz
 * @param {String} options.tanggal_mulai Tanggal Dimulainya Exam/Quiz
 * @param {String} options.deadline Deadline Pengerjaan Exam/Quiz
 * @param {String} options.durasi Durasi Pengerjaan Exam/Quiz
 * @param {String} options.kesempatan Banyaknya Kesempatan Mengerjakan Exam/Quiz
 * @param {String} options.can_back Apakah Exam/Quiz Bisa Kembali Ke Soal Sebelumnya?
 * @param {String} options.quotes Motivational Quotes
 * @returns {String} `String` — Data Message Exam Untuk Dikirim Ke Telegram
 * @author `ZulfaNurhuda.` — My Developer
 */
function replacerExam(options) {
    let data = fs.readFileSync(
        `${process.cwd()}/Template/messageTemplateExam.txt`,
        `utf8`
    );
    const dataReplaced = data.replace(
        /(\$\w+)/g,
        (kata) => (kata = options[kata.slice(1)])
    );
    return dataReplaced;
}

/**
 * **Send Telegram Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Mengirim Data Notification Ke Telegram
 * ```
 * @param {RogaClient} client Objek RogaClient
 * @param {String} type Tipe Data Yang Akan Di Notify
 * @param {Object} options Opsi Untuk Send Email
 * @param {String} options.nama_dosen Nama Dosen
 * @param {String} options.mata_kuliah Mata Kuliah
 * @param {String} options.nama_exam Nama Exam/Quiz
 * @param {String} options.nama_tugas Nama Tugas
 * @param {String} options.tanggal_mulai Tanggal Dimulainya Exam/Quiz
 * @param {String} options.deadline Deadline Pengerjaan Tugas/Exam/Quiz
 * @param {String} options.durasi Durasi Pengerjaan Exam/Quiz
 * @param {String} options.kesempatan Banyaknya Kesempatan Mengerjakan Exam/Quiz
 * @param {String} options.can_back Apakah Exam/Quiz Bisa Kembali Ke Soal Sebelumnya?
 * @param {String} options.quotes Motivational Quotes
 * @param {String} options.url_edunex URL Menuju Edunex
 * @returns {Promise<TelegramBot.Message>} `TelegramBot.Message` — Data Object Message Telegram Yang Sudah Terkirim
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendTelegram(client, type, options) {
    let messageFinal = ``;
    if (type === `assignment`)
        messageFinal = replacerAssignment({
            nama_dosen: options.nama_dosen,
            mata_kuliah: options.mata_kuliah,
            nama_tugas: options.nama_tugas,
            deadline: options.deadline,
            quotes: options.quotes,
        });
    if (type === `exam`)
        messageFinal = replacerExam({
            nama_dosen: options.nama_dosen,
            mata_kuliah: options.mata_kuliah,
            nama_exam: options.nama_exam,
            tanggal_mulai: options.tanggal_mulai,
            deadline: options.deadline,
            durasi: options.durasi,
            kesempatan: options.kesempatan,
            can_back: options.can_back,
            quotes: options.quotes,
        });

    let messageData = await client.TelegramClient.sendMessage(
        1332834117,
        messageFinal,
        {
            parse_mode: `HTML`,
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: `Buka Edunex`,
                            url: options.url_edunex,
                        },
                    ],
                ],
            },
        }
    )
        .then((i) => i)
        .catch((e) => {
            throw new Error(e);
        });

    return messageData;
}

module.exports = sendTelegram;
