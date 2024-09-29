/// Load Package
const fs = require(`fs`);

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
 * @param {String} options.tanggal_upload Tanggal Tugas Diunggah Oleh Dosen
 * @param {String} options.quotes Motivational Quotes
 * @param {String} options.url_edunex URL Menuju Edunex
 * @returns {String} `String` — Data HTML Assignment Untuk Dikirim Ke Email
 * @author `ZulfaNurhuda.` — My Developer
 */
function replacerAssignment(options) {
    let data = fs.readFileSync(
        `${process.cwd()}/Template/notificationAssignment.html`,
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
 * @param {String} options.tanggal_upload Tanggal Exam/Quiz Diunggah Oleh Dosen
 * @param {String} options.quotes Motivational Quotes
 * @param {String} options.url_edunex URL Menuju Edunex
 * @returns {String} `String` — Data HTML Exam Untuk Dikirim Ke Email
 * @author `ZulfaNurhuda.` — My Developer
 */
function replacerExam(options) {
    let data = fs.readFileSync(
        `${process.cwd()}/Template/notificationExam.html`,
        `utf8`
    );
    const dataReplaced = data.replace(
        /(\$\w+)/g,
        (kata) => (kata = options[kata.slice(1)])
    );
    return dataReplaced;
}

/**
 * **Send Email Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Mengirim Data Notification Ke Email
 * ```
 * @param {RogaClient} client Objek RogaClient
 * @param {String} type Tipe Data Yang Akan Di Notify
 * @param {Object} options Opsi Untuk Send Email
 * @param {String} options.id ID Untuk Setiap Pengiriman Notify
 * @param {String} options.nama_dosen Nama Dosen
 * @param {String} options.mata_kuliah Mata Kuliah
 * @param {String} options.nama_exam Nama Exam/Quiz
 * @param {String} options.nama_tugas Nama Tugas
 * @param {String} options.tanggal_mulai Tanggal Dimulainya Exam/Quiz
 * @param {String} options.deadline Deadline Pengerjaan Tugas/Exam/Quiz
 * @param {String} options.durasi Durasi Pengerjaan Exam/Quiz
 * @param {String} options.kesempatan Banyaknya Kesempatan Mengerjakan Exam/Quiz
 * @param {String} options.can_back Apakah Exam/Quiz Bisa Kembali Ke Soal Sebelumnya?
 * @param {String} options.tanggal_upload Tanggal Tugas/Exam/Quiz Diunggah Oleh Dosen
 * @param {String} options.quotes Motivational Quotes
 * @param {String} options.url_edunex URL Menuju Edunex
 * @returns {Promise<Object>} `Promise<Object>` — Data Object Email Yang Sudah Terkirim
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendEmail(client, type, options) {
    let htmlfile = ``;
    if (type === `assignment`)
        htmlfile = replacerAssignment({
            nama_dosen: options.nama_dosen,
            mata_kuliah: options.mata_kuliah,
            nama_tugas: options.nama_tugas,
            deadline: options.deadline,
            tanggal_upload: options.tanggal_upload,
            quotes: options.quotes,
            url_edunex: options.url_edunex,
        });
    if (type === `exam`)
        htmlfile = replacerExam({
            nama_dosen: options.nama_dosen,
            mata_kuliah: options.mata_kuliah,
            nama_exam: options.nama_exam,
            tanggal_mulai: options.tanggal_mulai,
            deadline: options.deadline,
            durasi: options.durasi,
            kesempatan: options.kesempatan,
            can_back: options.can_back,
            tanggal_upload: options.tanggal_upload,
            quotes: options.quotes,
            url_edunex: options.url_edunex,
        });

    var mailOptions = {
        from: process.env.GMAIL_APP_USERNAME,
        to: `afluzkeren@gmail.com`,
        subject: `${
            type === `assignment` ? `Tugas` : `Kuis/Ujian`
        } Baru Edunex! (#${options.id})`,
        html: htmlfile,
    };

    let emailData;
    try {
        emailData = await client.emailClient.sendMail(mailOptions);
    } catch (e) {
        throw new Error(e);
    }

    return emailData;
}

module.exports = sendEmail;
