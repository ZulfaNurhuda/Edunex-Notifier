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
 * ## **_edunexHandler_ Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Handler ini digunakan untuk menghubungkan dan berinteraksi dengan Edunex Learning Management System (LMS) milik Institut Teknologi Bandung. Fungsi ini berfungsi untuk mendapatkan data `todo` dari Edunex API dan memproses tugas serta ujian jika tersedia. Jika terjadi kesalahan selama proses, handler akan menonaktifkan client dan memanggil fungsi penanganan error Edunex.
 *
 * ### Informasi Tambahan:
 * - Pastikan bahwa `client` dalam status aktif sebelum memanggil handler ini.
 * - Fungsi ini menangani dua jenis data utama: tugas (assignment) dan ujian (exam) dari LMS.
 * - Jika terjadi kesalahan pada API Edunex, bot akan otomatis menonaktifkan `client`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: RogaClient,
 *     bearer: `your-edunex-api-bearer`,
 * };
 * await edunexHandler(options);
 * ```
 *
 * @param {RogaTypes.EdunexHandlerOptions} options Opsi konfigurasi untuk menjalankan Edunex Handler, termasuk instance client dan token bearer untuk autentikasi.
 * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menandakan handler berhasil dijalankan dan data dari API Edunex telah diproses.
 * @throws {RogaError} Jika terjadi kesalahan dalam memproses API atau jika respons Edunex menunjukkan adanya error.
 * @author `ZulfaNurhuda.` — My Developer
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
