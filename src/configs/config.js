/**
 * @fileoverview This file contains the configuration for the application.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

require('dotenv').config();

const configurations = {
    /**
     * The bearer token for the Edunex API.
     * @type {string}
     */
    edunexBearer: process.env.EDUNEX_BEARER,

    /**
     * The username for the Gmail app.
     * @type {string}
     */
    gmailAppUsername: process.env.GMAIL_APP_USERNAME,

    /**
     * The password for the Gmail app.
     * @type {string}
     */
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,

    /**
     * The destination email address for Gmail notifications.
     * @type {string}
     */
    gmailDest: process.env.GMAIL_DEST,

    /**
     * The token for the Telegram bot.
     * @type {string}
     */
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

    /**
     * The destination chat ID for Telegram notifications.
     * @type {string}
     */
    telegramDest: process.env.TELEGRAM_DEST,

    /**
     * The token for the Discord bot.
     * @type {string}
     */
    discordBotToken: process.env.DISCORD_BOT_TOKEN,

    /**
     * The channel ID for Discord bot notifications.
     * @type {string}
     */
    discordChannelId: process.env.DISCORD_CHANNEL_ID,

    /**
     * The URL for the Discord webhook.
     * @type {string}
     */
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,

    /**
     * The interval for the Edunex handler, in milliseconds.
     * @type {number}
     */
    edunexHandlerInterval:
        process.env.EDUNEX_HANDLER_INTERVAL || 1000 * 60 * 5,
};

module.exports = configurations;
