require(`dotenv`).config();
const RogaClient = require(`./Structure/RogaClient`);
const universalError = require(`./Handler/errorHandler/universalError`);
const chalk = require("chalk");
const mongoose = require("mongoose");

const Roga = new RogaClient({
    sendTo: [`TELEGRAM`, `EMAIL`],
    token: {
        telegram: process.env.TELEGRAM_BOT_TOKEN,
        email: {
            username: process.env.GMAIL_APP_USERNAME,
            password: process.env.GMAIL_APP_PASS,
        },
    },
});

Roga.connectDatabase(process.env.MONGO_URI)
    .then(async (i) => {
        i.connection.on(`connected`, () => {
            let bearer = process.env.EDUNEX_BEARER;
            Roga.edunexHandler({ bearer: bearer, client: Roga })
                .then(() => {
                    setInterval(() => {
                        Roga.edunexHandler({
                            bearer: bearer,
                            client: Roga,
                        }).catch(universalError);
                    }, 1000 * 60 * 5);
                })
                .catch(universalError);
        });
    })
    .catch(universalError);

process.on(`warning`, (e) => universalError(e));
process.on(`unhandledRejection`, (e) => universalError(e));
process.on(`uncaughtException`, (e) => universalError(e));
