require('dotenv').config();

const configurations = {
    edunexBearer: process.env.EDUNEX_BEARER,

    gmailAppUsername: process.env.GMAIL_APP_USERNAME,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
    gmailDest: process.env.GMAIL_DEST,

    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramDest: process.env.TELEGRAM_DEST,

    discordBotToken: process.env.DISCORD_BOT_TOKEN,
    discordChannelId: process.env.DISCORD_CHANNEL_ID,

    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,

    edunexHandlerInterval:
        process.env.EDUNEX_HANDLER_INTERVAL || 1000 * 60 * 5,
};

module.exports = configurations;
