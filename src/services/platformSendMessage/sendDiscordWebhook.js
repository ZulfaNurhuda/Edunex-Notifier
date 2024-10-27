/// Import Packages
const Discord = require(`discord.js`);

/// Import Structure
const RogaClient = require(`../../structures/RogaClient`);
const RogaError = require(`../../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../../types/types`);

/**
 * ## **_sendDiscordWebhook_ Service Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk mengirimkan data notifikasi ke Webhook Discord dengan menggunakan client Discord.
 * Menghasilkan pesan yang dikirimkan melalui webhook, dengan tambahan tombol menuju URL Edunex jika diberikan.
 *
 * ### Informasi Tambahan:
 * - Parameter `options` harus berupa objek valid yang berisi informasi yang diperlukan untuk mengirim pesan melalui webhook.
 * - Fungsi ini secara otomatis mem-parsing `message` sebagai JSON dan memvalidasi adanya setidaknya satu dari `content` atau `embeds`.
 * - Jika terjadi kesalahan dalam pengiriman atau parsing data, fungsi ini akan melempar `RogaError` untuk memudahkan debugging.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: RogaClient,
 *     url_edunex: `https://edunex.example.com`,
 *     message: JSON.stringify({
 *         content: `Hello, this is a notification!`,
 *         embeds: [{ title: `Edunex Notification`, description: `Check out this link!` }]
 *     })
 * };
 *
 * try {
 *     const result = await sendDiscordWebhook(options);
 *     console.log(`Pesan terkirim:`, result);
 * } catch (error) {
 *     console.error(`Gagal mengirim pesan:`, error);
 * }
 * ```
 *
 * @param {RogaTypes.SendDiscordWebhookOptions} options Opsi untuk mengirim Discord Webhook.
 * @returns {Promise<Discord.APIMessage>} Data objek message Discord yang sudah terkirim.
 * @throws {RogaError} Jika terjadi kesalahan dalam mengirim webhook, parsing pesan, atau jika parameter `options` tidak valid.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendDiscordWebhook(options) {
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

    /**
     * **Discord Message Data for Webhook**
     * @type {Discord.Message}: Tipe data yang merepresentasikan struktur Discord message.
     */
    let data = {};

    try {
        data = JSON.parse(message);
    } catch (error) {
        throw new RogaError(`Gagal parsing message sebagai JSON.`);
    }

    if (!data.content && !data.embeds) {
        throw new RogaError(
            `Message yang dikirim harus mengandung setidaknya salah satu dari "content" atau "embeds".`
        );
    }

    const urlEdunex = data.embeds[0].url;

    const button = new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Link)
        .setLabel(`Buka Edunex`)
        .setURL(urlEdunex);

    const actionRow = new Discord.ActionRowBuilder().addComponents(button);

    if (
        !client.webhookClient ||
        !(client.webhookClient instanceof Discord.WebhookClient)
    ) {
        throw new RogaError(
            `WebhookClient harus merupakan instance dari Discord WebhookClient.`
        );
    }

    try {
        const sentMessage = await client.webhookClient.send({
            username: `ROGA! | Edunex Notifier`,
            avatarURL: `https://i.imgur.com/reT8jxT.png`,
            data,
            components: [actionRow],
        });
        return sentMessage;
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendDiscordWebhook;
