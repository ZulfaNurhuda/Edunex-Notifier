/// Import Packages
const chalk = require(`chalk`);

/// Import Configurations
require(`dotenv`).config();
const configurations = require(`./configs/config`);

/// Import Structures
const RogaClient = require(`./structures/RogaClient`);

/// Import Handlers
const universalError = require(`./handlers/errorHandler/universalError`);
const gracefulShutdown = require(`./handlers/errorHandler/gracefulShutdown`);

/// Inisialisasi dan Kode Utama
const Roga = new RogaClient();
(async () => {
    try {
        await Roga.loadConfig(configurations);
        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | [RogaBot] Konfigurasi Berhasil Dimuat! `
            )
        );
        await Roga.start();
        console.log(
            chalk.bgGreen.whiteBright(` ✔️ | [RogaBot] Berhasil Aktif! `)
        );
    } catch (error) {
        universalError(error);
    }
})();

/// Handling Node.JS Event
[`warning`, `uncaughtException`].forEach((type) =>
    process.on(type, (error) => universalError(error))
);
[`SIGINT`, `SIGTERM`, `SIGQUIT`].forEach((type) =>
    process.on(type, () => gracefulShutdown(Roga))
);
