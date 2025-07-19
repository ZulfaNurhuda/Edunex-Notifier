/**
 * @fileoverview This file contains the main logic for sending notifications to all supported platforms.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

/// Import Packages
const fs = require(`fs`);
const path = require(`path`);
const chalk = require(`chalk`);

/// Import Structures
const RogaError = require(`../../structures/RogaError.js`);

/// Import Types
const RogaTypes = require(`../../types/types.js`);

/// Import Service
const sendEmail = require(`./sendEmail.js`);
const sendTelegram = require(`./sendMessageTelegram.js`);
const sendWebhook = require(`./sendDiscordWebhook.js`);
const sendDiscordBot = require(`./sendDiscordBot.js`);

/**
 * Capitalizes the first letter of a string.
 * @param {string} str The string to capitalize.
 * @returns {string} The capitalized string.
 * @throws {RogaError} If the input is not a valid string.
 */
function capitalizeFirstLetter(str) {
    if (!str || typeof str !== `string`) {
        throw new RogaError(`Parameter harus berupa string yang valid.`);
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * An object to store the loaded templates.
 * @type {RogaTypes.TemplateFile}
 */
const templateFile = {};

/**
 * Loads all the templates from the `src/templates` directory.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while loading the templates.
 */
async function loadTemplates() {
    const types = [`assignment`, `exam`];
    const platforms = [`email`, `telegram`, `webhook`];

    const extensionMap = {
        email: `html`,
        telegram: `txt`,
        webhook: `json`,
    };

    for (const type of types) {
        templateFile[type] = {};

        for (const platform of platforms) {
            const ext = extensionMap[platform];
            const filePath = path.join(
                process.cwd(),
                `src`,
                `templates`,
                type,
                `messageTemplate${capitalizeFirstLetter(type)}.${ext}`
            );

            try {
                const content = await fs.promises.readFile(filePath, `utf8`);
                templateFile[type][platform] = content;
            } catch (error) {
                throw new RogaError(error.message || error);
            }
        }
    }
}

/**
 * Replaces the variables in a template with the given values.
 * @param {RogaTypes.ReplacerOptions} options The options for replacing the variables.
 * @returns {string} The template with the variables replaced.
 * @throws {RogaError} If the template is not found or a required parameter is missing.
 */
function replacerVariable(options) {
    let data = templateFile[options.type][options.platform];
    if (!data) {
        throw new RogaError(
            `Template untuk type: ${options.type} dan platform: ${options.platform} tidak ditemukan.`
        );
    }

    return data.replace(/\$(\w+)/g, (_, kata) => {
        if (options.message[kata] === undefined) {
            throw new RogaError(
                `Parameter ${kata} belum dimasukkan ke dalam options.message!`
            );
        }
        return options.message[kata];
    });
}

/**
 * Sends a message to all supported platforms.
 * @param {string} type The type of the message to send.
 * @param {RogaTypes.SendDataAssignment|RogaTypes.SendDataExam} options The options for sending the message.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the message.
 */
async function sendMessage(type, options) {
    if (!type || ![`assignment`, `exam`].includes(type)) {
        throw new RogaError(
            `Parameter type harus berupa string yang valid (antara "assignment" atau "exam").`
        );
    }

    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, message } = options;

    if (!client || !(client instanceof RogaClient)) {
        return new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (typeof message !== `object`) {
        throw new RogaError(
            `Message yang akan dikirim harus berupa objek (AssignmentMessageDetails atau ExamMessageDetails).`
        );
    }

    try {
        await loadTemplates();
    } catch (error) {
        throw new RogaError(error.message || error);
    }

    const platforms = [
        {
            name: `gmail`,
            client: client.gmailClient,
            to: client.config.gmailDest,
            sender: sendEmail,
        },
        {
            name: `telegram`,
            client: client.telegramClient,
            to: client.config.telegramDest,
            sender: sendTelegram,
        },
        {
            name: `webhook`,
            client: client.webhookClient,
            to: client.config.discordWebhookUrl,
            sender: sendWebhook,
        },
        {
            name: `discord`,
            client: client.discordClient,
            to: client.config.discordChannelId,
            sender: sendDiscordBot,
        },
    ];

    for (const platform of platforms) {
        if (platform.client && platform.to) {
            console.log(
                chalk.bgGreen.whiteBright(
                    ` ✔️ | Distribusi pesan ${type} melalui media ${capitalizeFirstLetter(
                        platform.name
                    )} sedang berlangsung. [${new Date()}] `
                )
            );
            try {
                const replacedMessage = replacerVariable({
                    type,
                    platform: platform.name,
                    message,
                });

                const sendOptions = {
                    client,
                    url_edunex: message.url_edunex,
                    message: replacedMessage,
                };
                await platform.sender(sendOptions);
                console.log(
                    chalk.bgGreen.whiteBright(
                        ` ✔️ | Distribusi pesan ${type} melalui media ${capitalizeFirstLetter(
                            platform.name
                        )} sukses. [${new Date()}] `
                    )
                );
            } catch (error) {
                throw new RogaError(error.message || error);
            }
        }
    }
}

/**
 * Sends an exam notification.
 * @param {RogaTypes.SendDataExam} options The options for sending the notification.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the notification.
 */
async function examType(options) {
    await sendMessage('exam', options);
}

/**
 * Sends an assignment notification.
 * @param {RogaTypes.SendDataAssignment} options The options for sending the notification.
 * @returns {Promise<void>}
 * @throws {RogaError} If an error occurs while sending the notification.
 */
async function assignmentType(options) {
    await sendMessage('assignment', options);
}

module.exports = { examType, assignmentType };
