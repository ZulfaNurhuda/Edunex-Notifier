/// Import Packages
const cheerio = require(`cheerio`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/**
 * ## **_sendEmail_ Service Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Digunakan untuk mengirim data notifikasi Edunex ke email client. Fungsi ini memproses pesan HTML
 * yang diberikan dalam `options.message`, mendeteksi tipe notifikasi (Tugas atau Kuis/Ujian), dan mengirim email
 * sesuai konfigurasi client yang disediakan.
 *
 * ### Informasi Tambahan:
 * - Parameter `options` harus berupa objek valid yang berisi `client` dan `message`.
 * - `client` harus instance dari `RogaClient`, yang menyediakan informasi konfigurasi untuk pengiriman email.
 * - `message` adalah string HTML yang akan diurai menggunakan `cheerio` untuk mengekstrak jenis notifikasi dan ID.
 * - Jika terjadi kesalahan saat parsing atau pengiriman email, fungsi ini akan melempar `RogaError`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: RogaClient,
 *     message: `<html><h3>Tugas Baru</h3><a href=`https://edunex.example.com/123`>Link Tugas</a></html>`
 * };
 *
 * try {
 *     const result = await sendEmail(options);
 *     console.log(`Email terkirim:`, result);
 * } catch (error) {
 *     console.error(`Gagal mengirim email:`, error);
 * }
 * ```
 *
 * @param {RogaTypes.SendGmailOptions} options Opsi untuk mengirim email.
 * @returns {Promise<Object>} Data objek email yang sudah terkirim.
 * @throws {RogaError} Jika terjadi kesalahan dalam pengiriman email atau parsing pesan.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendEmail(options) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, message } = options;

    if (!client || !(client instanceof RogaClient)) {
        return new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (typeof message !== `string`) {
        throw new RogaError(`Message yang akan dikirim harus berupa string.`);
    }

    const $ = cheerio.load(message);
    const type = $(`h3`).text().trim().toLowerCase().includes(`tugas`)
        ? `Tugas`
        : `Kuis/Ujian`;
    const id = $(`a`).attr(`href`).trim().toLowerCase().match(/(\d+)/)[1];

    const mailOptions = {
        from: client.config.gmailUsername,
        to: client.config.defaultUsers.gmailUsername,
        subject: `${type} Baru Edunex! (#${id})`,
        html: message,
    };

    try {
        const emailData = await client.gmailClient.sendMail(mailOptions);
        return emailData;
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendEmail;
