/// Load Package
const chalk = require("chalk");
const mongoose = require(`mongoose`);

/**
 * **Connect Database Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Terhubung Dengan Database Dari MongoDB
 * ```
 * @param {String} token Mongo URI Untuk Terhubung Dengan MongoDB
 * @returns {Promise<mongoose>} `Promise<mongoose>` — Database Terhubung
 * @author `ZulfaNurhuda.` — My Developer
 */
async function connectDatabase(token) {
    const dbOptions = {
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
    };

    mongoose.connect(token, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on(`connecting`, () => {
        console.log(
            chalk.bgGray.bold.white(` - | Mencoba Menyambung Ke Database`)
        );
    });
    mongoose.connection.on(`connected`, () => {
        console.log(chalk.bgGreen.bold.white(` V | Tersambung Ke Database `));
    });
    mongoose.connection.on(`reconnecting`, () => {
        console.log(
            chalk.bgGray.bold.white(
                ` - | Mencoba Menyambungkan Ulang Ke Database `
            )
        );
    });
    mongoose.connection.on(`disconected`, () => {
        throw new Error(`Sambungan Database Terputus`);
    });
    mongoose.connection.on(`err`, (e) => {
        throw new Error(e);
    });

    return mongoose;
}

module.exports = connectDatabase;
