require('dotenv').config({ path: `${process.cwd()}/.env`});
const TelegramBot = require(`node-telegram-bot-api`);
const mongoose = require(`mongoose`);
const handler = require(`./Utility/handler`);
const database = require(`./Utility/database`);

const client = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

if (client) {
    database().catch(e => console.error(`X | Error: ${e}`));
    mongoose.connection.on(`connected`, () => {
        handler(client).then(() => {
            console.log(`V | System is Ready!`)
            setInterval(() => {
                handler(client).catch(e => console.error(`X | Error: ${e}`));
            }, 1000 * 60 * 5)
        })
        .catch(e => console.error(`X | Error: ${e}`));
    })
}

process.on(`warning`, (e) => console.error(`X | Error: ${e}`));
process.on(`unhandledRejection`, (e) => console.error(`X | Error: ${e}`))
process.on(`uncaughtException`, (e) => console.error(`X | Error: ${e}`))