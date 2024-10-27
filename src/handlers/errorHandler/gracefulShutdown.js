/// Import Packages
const mongoose = require(`mongoose`);
const chalk = require(`chalk`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);

/// Import Handlers
const universalError = require(`./universalError`);

/**
 * ## **_gracefulShutdown_ Handler Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk menangani proses penghentian aplikasi secara `graceful` (tertib) dengan menutup semua koneksi eksternal sebelum aplikasi benar-benar berhenti. Fungsi ini memastikan bahwa semua koneksi ke layanan seperti MongoDB, Discord, Telegram, dan Gmail ditutup dengan benar untuk menghindari kebocoran sumber daya atau kondisi yang tidak stabil.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini akan menutup koneksi ke MongoDB jika koneksi aktif.
 * - Koneksi bot ke Discord dan Telegram akan dihentikan untuk memastikan tidak ada aktivitas bot yang tertinggal setelah aplikasi dimatikan.
 * - Jika terdapat koneksi aktif ke Gmail (melalui `gmailClient`), maka koneksi tersebut juga akan ditutup.
 * - Jika proses penghentian berhasil, aplikasi akan keluar dengan status `0`, menandakan bahwa penghentian berjalan sukses. Namun, jika terjadi kesalahan, proses akan keluar dengan status `1` untuk menandakan kesalahan.
 *
 * ### Catatan:
 * - Proses penghentian yang tidak tertib dapat menyebabkan masalah pada aplikasi yang harus dijalankan kembali. Oleh karena itu, fungsi ini memastikan bahwa semua sumber daya telah ditutup dengan aman sebelum aplikasi dihentikan.
 * - Jika ada kesalahan yang terjadi saat penutupan, error akan dilog dan aplikasi akan keluar dengan status `1`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * process.on(`SIGINT`, () => gracefulShutdown(RogaClient));
 * ```
 *
 * @param {RogaClient} client Objek RogaClient yang berisi koneksi yang akan dihentikan (seperti koneksi ke MongoDB, Discord, Telegram, dan Gmail).
 * @returns {Promise<never>} Tidak mengembalikan nilai, karena fungsi ini menutup aplikasi setelah menyelesaikan proses penghentian.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function gracefulShutdown(client) {
    if (!client || !(client instanceof RogaClient)) {
        return universalError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    console.log(
        chalk.bgYellow.whiteBright(` ⚠️ | Menyiapkan penutupan program `)
    );
    try {
        if (mongoose.connection) await mongoose.connection.close();
        if (client.discordClient) await client.discordClient.destroy();
        if (client.telegramClient) await client.telegramClient.stopPolling();
        if (client.gmailClient) client.gmailClient.close();

        console.log(
            chalk.bgGreen.whiteBright(` ✔️ | Semua koneksi berhasil ditutup. `)
        );
        process.exit(0);
    } catch (error) {
        universalError(error);
        process.exit(1);
    }
}

module.exports = gracefulShutdown;
