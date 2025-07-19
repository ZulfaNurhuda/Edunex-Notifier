/**
 * @fileoverview This file contains the logic for sending messages to a Telegram bot.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/**
 * Sends a message to a Telegram bot.
 * @param {object} options The options for sending the message.
 * @param {RogaClient} options.client The RogaClient instance.
 * @param {string} options.message The message to send.
 * @param {string} options.url_edunex The URL to the Edunex page.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the message.
 */
async function sendMessageTelegram({ client, message, url_edunex }) {
    if (!client.telegramClient) {
        throw new RogaError('Telegram client is not initialized.');
    }

    try {
        await client.telegramClient.sendMessage(
            client.config.telegramDest,
            message,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `Buka Edunex`,
                                url: url_edunex,
                            },
                        ],
                    ],
                },
            }
        );
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendMessageTelegram;
