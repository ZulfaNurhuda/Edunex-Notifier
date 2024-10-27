/// Import Packages
const chalk = require(`chalk`);

/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/**
 * ## **_universalError_ Handler Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk menangani kesalahan yang terjadi di seluruh aplikasi RogaBot.
 * Ketika sebuah error terjadi, fungsi ini akan mencetak pesan error yang jelas ke konsol dan memberikan informasi yang lebih rinci jika `stack trace` tersedia.
 * Hal ini memastikan bahwa kesalahan dapat dilacak dengan lebih baik selama pengembangan atau dalam produksi.
 *
 * ### Informasi Tambahan:
 * - Error dapat berasal dari berbagai sumber, baik dari kesalahan logika program, kesalahan API, atau kesalahan tak terduga lainnya.
 * - Jika `stack trace` dari error tersedia, fungsi ini akan mencetaknya untuk membantu dalam proses debugging.
 * - Jika `stack trace` tidak tersedia, fungsi akan mencetak pesan error sederhana ke konsol.
 * - Fungsi ini tidak menghentikan eksekusi aplikasi, tetapi hanya melaporkan error yang terjadi.
 *
 * ### Contoh Penggunaan:
 * ```js
 * try {
 *     // Beberapa kode mungkin akan menghasilkan error
 * } catch (error) {
 *     universalError(error); // Memanggil handler untuk menangani error
 * }
 * ```
 *
 * @param {RogaError} error Objek RogaError yang terjadi ketika ada error di aplikasi.
 * @returns {void} Mengembalikan `void` yang menandakan bahwa proses error handler berhasil dieksekusi.
 * @author `ZulfaNurhuda.` — My Developer
 */
function universalError(error) {
    if (!error || !(error instanceof Error)) {
        return console.error(`Error harus berupa instance dari Error`);
    }

    console.log(chalk.bgRed.bold.whiteBright(` ❌ | ERROR TERJADI! `));
    if (error.stack) {
        console.error(error.stack);
    } else {
        console.error(error);
    }
}

module.exports = universalError;
