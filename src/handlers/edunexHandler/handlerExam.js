/// Import Packages
const moment = require(`moment-timezone`);
const mongoose = require(`mongoose`);
moment.locale(`id`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/// Import Schemas
const Exam = require(`../../schemas/examSchema`); // Pastikan Anda memiliki schema Exam

/// Import Utils
const edunexRequest = require(`../../utils/edunexRequest`);

/// Import Services
const sendData = require(`../../services/platformSendMessage/send`);

/**
 * ## **_edunexHandlerExam_ Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk mengelola data ujian (exam) yang diambil dari Edunex Learning Management System (LMS) milik Institut Teknologi Bandung. Fungsi ini memproses dan mengirimkan data ujian ke platform yang terkait.
 * Jika terdapat perubahan data ujian, fungsi ini akan memperbarui informasi ujian tersebut dalam database atau melakukan tindakan sesuai kebutuhan platform.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini memeriksa data ujian dari Edunex untuk memastikan bahwa data yang diambil sesuai dengan yang dibutuhkan oleh platform yang terkait.
 * - Jika terjadi kesalahan pada API Edunex saat mengambil data ujian, fungsi akan menangani kesalahan tersebut tanpa menghentikan seluruh proses.
 * - Data ujian yang dikirim akan disesuaikan dengan format yang dibutuhkan oleh platform terkait dan akan diproses lebih lanjut jika terdapat perubahan atau update.
 * - ID dari ujian (`exam.id`) digunakan untuk mengambil detail lebih lanjut terkait ujian dari Edunex.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     bearer: `your-edunex-api-bearer`,
 *     exam: examData, // Data ujian dari Edunex
 *     client: RogaClient,
 * };
 * await edunexHandlerExam(options);
 * ```
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options Opsi untuk Edunex Handler Exam, yang mencakup token autentikasi, data `exam`, dan instance client.
 * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menandakan bahwa proses handler ujian berhasil dieksekusi.
 * @throws {RogaError} Jika terjadi kesalahan pada validasi parameter atau memproses data dari API Edunex atau menyimpan ujian ke database.
 * @author `ZulfaNurhuda.` — My Developer
 */

async function edunexHandlerExam(options) {
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

    for (const exam of todo.exams) {
        try {
            const existingExam = await Exam.findOne({ examId: exam.id });

            /**
             * **Data Exam dari Edunex**
             * @type {RogaTypes.EdunexExamData}: Tipe data yang merepresentasikan informasi ujian dari API Edunex.
             */
            const examData = await edunexRequest({
                bearer,
                path: `/exam/exams/${exam.id}`,
            });

            /**
             * **Data Lecturer dari Edunex**
             * @type {RogaTypes.EdunexUserData}: Tipe data yang merepresentasikan informasi pengguna dari API Edunex.
             */
            const lecturerData = await edunexRequest({
                bearer,
                path: `/stats/user/${examData.data.attributes.created_by}`,
            });

            if (!existingExam) {
                const message = {
                    nama_dosen: lecturerData.user.name,
                    mata_kuliah: `${exam.course} (${exam.code})`,
                    nama: examData.data.attributes.name,
                    tanggal_mulai: moment(examData.data.attributes.start_at)
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    deadline: moment(examData.data.attributes.end_at)
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    tanggal_upload: moment(examData.data.attributes.created_at)
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    durasi: `${examData.data.attributes.duration} Menit`,
                    kesempatan: examData.data.attributes.retry,
                    can_back:
                        examData.data.attributes.is_back === 1
                            ? `Bisa`
                            : `Tidak Bisa`,
                    url_edunex: `https://edunex.itb.ac.id/exam/take/${exam.id}`, // Perbaiki path jika diperlukan
                };

                await sendData.examType({ client, message });

                const newExam = new Exam({
                    _id: new mongoose.Types.ObjectId(),
                    examId: exam.id,
                    examData: JSON.stringify(exam),
                });
                await newExam.save();
            } else {
                const dataFromDatabase = existingExam.examData;
                const dataFromEdunex = exam;

                if (dataFromDatabase !== JSON.stringify(dataFromEdunex)) return;
                existingExam.examData = exam;
                await existingExam.save();

                // Optionally, send update notifications
                // Contoh:
                // await sendData.examUpdate({
                //     client,
                //     message: { ... },
                // });
            }
        } catch (error) {
            throw new RogaError(error.message || error);
        }
    }
}

module.exports = edunexHandlerExam;
