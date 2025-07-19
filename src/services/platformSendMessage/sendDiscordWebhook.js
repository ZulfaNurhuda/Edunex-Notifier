/**
 * @fileoverview This file contains the logic for sending messages to a Discord webhook.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

/// Import Structures
const RogaError = require(`../../structures/RogaError`);
const Discord = require('discord.js');

/**
 * Sends a message to a Discord webhook.
 * @param {object} options The options for sending the message.
 * @param {RogaClient} options.client The RogaClient instance.
 * @param {string} options.message The message to send.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the message.
 */
async function sendDiscordWebhook({ client, message }) {
    if (!client.webhookClient) {
        throw new RogaError('Webhook client is not initialized.');
    }

    try {
        const data = JSON.parse(message);
        const urlEdunex = data.embeds[0].url;

        const button = new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel(`Buka Edunex`)
            .setURL(urlEdunex);

        const actionRow = new Discord.ActionRowBuilder().addComponents(button);

        await client.webhookClient.send({
            username: `ROGA! | Edunex Notifier`,
            avatarURL: `https://i.imgur.com/reT8jxT.png`,
            ...data,
            components: [actionRow],
        });
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendDiscordWebhook;
