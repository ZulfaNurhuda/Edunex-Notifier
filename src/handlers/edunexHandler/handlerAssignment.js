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
const Assignment = require(`../../schemas/assignmentSchema`);

/// Import Utils
const edunexRequest = require(`../../utils/edunexRequest`);

/// Import Services
const sendData = require(`../../services/platformSendMessage/send`);

/**
 * ## **_edunexHandlerAssignment_ Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk mengelola data assignment (tugas) yang diambil dari Edunex Learning Management System (LMS) milik Institut Teknologi Bandung. Fungsi ini memproses setiap tugas yang ada dalam data `todo`, mengirimnya ke platform yang terkait, dan menyimpan tugas yang belum ada ke dalam database.
 * Jika terdapat perubahan data tugas, fungsi ini akan memperbarui informasi tugas tersebut dalam database.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini memverifikasi apakah tugas sudah ada dalam database, jika belum, data akan diambil dari API Edunex.
 * - Jika terjadi kesalahan pada satu tugas, fungsi akan tetap melanjutkan proses untuk tugas lainnya.
 * - Data tugas yang dikirim akan disesuaikan dengan format yang dibutuhkan oleh platform terkait.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     bearer: `your-edunex-api-bearer`,
 *     todo: todoData, // Data todo dari Edunex
 *     client: RogaClient,
 * };
 * await edunexHandlerAssignment(options);
 * ```
 *
 * @param {RogaTypes.EdunexModulesHandlerOptions} options Opsi untuk Edunex Handler Assignment, yang mencakup token autentikasi, data `todo`, dan instance client.
 * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menunjukkan bahwa proses assignment berhasil dieksekusi.
 * @throws {RogaError} Jika terjadi kesalahan pada validasi parameter atau memproses data dari API Edunex atau menyimpan tugas ke database.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function edunexHandlerAssignment(options) {
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

    for (const task of todo.tasks) {
        try {
            const existingAssignment = await Assignment.findOne({
                assignmentId: task.id,
            });

            /**
             * **Data Assignment dari Edunex**
             * @type {RogaTypes.EdunexTaskData}: Tipe data yang merepresentasikan informasi tugas dari API Edunex.
             */
            const assignmentData = await edunexRequest({
                bearer,
                path: `/course/tasks/${task.id}`,
            });

            if (!existingAssignment) {
                const message = {
                    nama_dosen: assignmentData.data.attributes.created_by,
                    mata_kuliah: `${task.course} (${task.code})`,
                    nama: assignmentData.data.attributes.name,
                    tanggal_mulai: moment(
                        assignmentData.data.attributes.start_at
                    )
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    deadline: moment(assignmentData.data.attributes.end_at)
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    tanggal_upload: moment(
                        assignmentData.data.attributes.created_at
                    )
                        .tz(`Asia/Jakarta`)
                        .format(`LLLL`),
                    url_edunex: `https://edunex.itb.ac.id/assignment/take/${task.id}`,
                };

                await sendData.assignmentType({ client, message });

                const newAssignment = new Assignment({
                    _id: new mongoose.Types.ObjectId(),
                    assignmentId: task.id,
                    assignmentData: JSON.stringify(task),
                });
                await newAssignment.save();
            } else {
                const dataFromDatabase = existingAssignment.assignmentData;
                const dataFromEdunex = task;

                if (dataFromDatabase === JSON.stringify(dataFromEdunex)) return;

                existingAssignment.assignmentData = JSON.stringify(task);
                await existingAssignment.save();

                // Optionally, send update notifications
                // Contoh:
                // await sendData.assignmentUpdate({
                //     client,
                //     message: { ... },
                // });
            }
        } catch (error) {
            throw new RogaError(error.message || error);
        }
    }
}

module.exports = edunexHandlerAssignment;
