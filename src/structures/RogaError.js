/**
 * ## **RogaError Class Constructor | RogaBot © 2024 - ZulfaNurhuda**
 *
 * Kelas `RogaError` adalah subclass dari `Error` yang dirancang khusus untuk menangani error yang terjadi di dalam `RogaBot`. Kelas ini memungkinkan penanganan error yang lebih spesifik dengan menambahkan nama error khusus dan melacak tumpukan error secara otomatis.
 *
 * ### Informasi Tambahan:
 * - `RogaError` dapat digunakan untuk melempar error dengan pesan yang disesuaikan untuk debugging yang lebih efektif.
 * - Error yang dilempar dari kelas ini akan memiliki nama `RogaError`, memudahkan identifikasi ketika ditangani oleh sistem error.
 *
 * ### Contoh Penggunaan:
 * ```js
 * throw new RogaError("Terjadi kesalahan pada sistem RogaBot", { cause: someError });
 * ```
 *
 * @class **RogaError**
 * @extends Error
 * @param {string} message Pesan error yang akan ditampilkan ketika error dilempar.
 * @param {ErrorOptions} options Opsi tambahan untuk konfigurasi error, seperti properti `cause` untuk melacak asal error.
 */
class RogaError extends Error {
    /**
     * @constructor Menginisialisasi properti default RogaError.
     */
    constructor(message, options) {
        super(message, options);
        this.name = `RogaError`;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RogaError);
        }
    }
}

module.exports = RogaError;
