/// Import Packages
const Telegram = require(`node-telegram-bot-api`);

/// Import Structures
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/**
 * ## **_sendTelegram_ Service Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk mengirim notifikasi ke Telegram menggunakan objek RogaClient yang telah terautentikasi.
 *
 * ### Informasi Tambahan:
 * - Pastikan instance `RogaClient` yang digunakan telah dikonfigurasi dengan benar.
 * - Pesan yang akan dikirim harus berupa string. Jika terdapat URL, URL akan otomatis ditampilkan sebagai link `Buka Edunex`.
 * - ID Chat Telegram dapat dikonfigurasi melalui parameter atau menggunakan ID default dari pengaturan.
 * - Jika terjadi kesalahan saat pengiriman pesan, fungsi ini akan menangani dan melaporkan kesalahan tersebut melalui exception.
 *
 * ### Contoh Penggunaan:
 * ```javascript
 * const options = {
 *     client: RogaClient,
 *     message: `<html><h3>Tugas Baru</h3><a href=`https://edunex.example.com/123`>Link Tugas</a></html>`
 * };
 *
 * try {
 *     const result = await sendTelegram(options);
 *     console.log(`Telegram terkirim:`, result.message_id);
 * } catch (error) {
 *     console.error(`Gagal mengirim email:`, error);
 * }
 * ```
 *
 * @param {RogaTypes.SendTelegramOptions} options - Opsi untuk mengirim Telegram.
 * @returns {Promise<Telegram.Message>} Mengembalikan objek pesan Telegram yang telah dikirim.
 * @throws {RogaError} Jika parameter tidak valid atau terjadi kesalahan saat pengiriman pesan.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendTelegram(options) {
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

    const urlEdunex = message
        .trim()
        .toLowerCase()
        .match(/https?:\/\/[^\s]+/)[0];
    const sanitizedMessage = replace(urlEdunex, ``);

    const teleOptions = {
        parse_mode: `HTML`,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Buka Edunex`,
                        url: urlEdunex,
                    },
                ],
            ],
        },
    };

    try {
        const sentMessage = await client.telegramClient.sendMessage(
            client.config.defaultUsers.telegramUserId,
            sanitizedMessage,
            teleOptions
        );
        return sentMessage;
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendTelegram;
