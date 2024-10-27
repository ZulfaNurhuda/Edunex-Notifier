/// Import Packages
const mongoose = require(`mongoose`);

/// Import Structures
const RogaError = require(`../structures/RogaError`);

/**
 * ## **Connect Database Utils Function | RogaBot © 2024 - ZulfaNurhuda**
 *
 * Fungsi ini digunakan untuk menghubungkan aplikasi dengan database MongoDB menggunakan Mongoose.
 * Fungsi ini akan mencoba membuat koneksi ke MongoDB dan memberikan status apakah koneksi berhasil atau terjadi kesalahan.
 *
 * ### Informasi Tambahan:
 * - Pastikan MongoDB URI yang diberikan sesuai dengan format URI MongoDB yang benar.
 * - Setelah terhubung, Mongoose akan menangani koneksi secara otomatis dan mengelola proses CRUD (Create, Read, Update, Delete).
 * - Koneksi yang berhasil akan memicu event `connected` pada Mongoose.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const uri = `mongodb://localhost:27017/mydatabase`;
 * connectDatabase(uri)
 *   .then(() => console.log(`Database berhasil terhubung`))
 *   .catch(error => console.error(`Kesalahan koneksi:`, error));
 * ```
 *
 * @param {string} mongoURI URI MongoDB yang digunakan untuk menghubungkan aplikasi ke database MongoDB.
 * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menunjukkan bahwa proses koneksi ke database telah berhasil.
 * @throws {RogaError} — Jika terjadi kesalahan selama proses koneksi, fungsi ini akan melemparkan error dengan informasi terkait kesalahan tersebut.
 * @author `ZulfaNurhuda.` — My Developer
 */

async function connectDatabase(mongoURI) {
    if (!mongoURI || typeof mongoURI !== `string` || !mongoURI.trim()) {
        throw new RogaError(
            `Parameter "mongoURI" harus berupa string MongoDB URI yang valid.`
        );
    }

    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        poolSize: 10,
    };

    try {
        await mongoose.connect(mongoURI, dbOptions);
        mongoose.Promise = global.Promise;
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = connectDatabase;
