/**
 * @fileoverview This file contains the logic for sending emails.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

/// Import Structures
const RogaError = require(`../../structures/RogaError`);

/**
 * Sends an email.
 * @param {object} options The options for sending the email.
 * @param {RogaClient} options.client The RogaClient instance.
 * @param {string} options.message The message to send.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the email.
 */
async function sendEmail({ client, message }) {
    if (!client.gmailClient) {
        throw new RogaError('Gmail client is not initialized.');
    }

    try {
        await client.gmailClient.sendMail({
            from: `"RogaBot" <${client.config.gmailAppUsername}>`,
            to: client.config.gmailDest,
            subject: 'Edunex Notifier',
            html: message,
        });
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = sendEmail;
