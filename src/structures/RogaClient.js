/// Import Packages
const Discord = require(`discord.js`);
const mongoose = require(`mongoose`);
const nodemailer = require(`nodemailer`);
const Telegram = require(`node-telegram-bot-api`);
const chalk = require(`chalk`);

/// Import Types
const Mailer = require(`nodemailer/lib/mailer`);
const RogaTypes = require(`../types/types`);

/// Import Structures
const RogaError = require(`./RogaError`);

/// Import Utils
const database = require(`../utils/database`);

/// Import Handlers
const edunexHandler = require(`../handlers/edunexHandler/handler`);

/**
 * ## **Kelas RogaClient | RogaBot © 2024 - ZulfaNurhuda**
 *
 * Kelas utama untuk menginisialisasi dan mengelola semua aktivitas RogaBot.
 * Kelas ini bertanggung jawab dalam mengonfigurasi layanan penting seperti Edunex API, MongoDB, Gmail, Telegram, dan Discord.
 *
 * ### Fitur:
 * - **Manajemen Konfigurasi:** Memuat dan mengelola konfigurasi untuk berbagai layanan.
 * - **Integrasi Layanan:** Menghubungkan Edunex API ke API MongoDB, Gmail, Telegram, dan Discord.
 * - **Penanganan Error:** Menyediakan mekanisme untuk menangkap dan menangani error secara efisien.
 * - **Notifikasi Pengguna:** Mengelola pengguna default dan pengaturan notifikasi untuk laporan error.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const RogaClient = require(`path-to-rogaclient`);
 * const Roga = new RogaClient();
 * (async () => {
 *     try {
 *         await Roga.loadConfig({
 *             mongoURI: `your-mongo-uri`,
 *             gmailUsername: `your-gmail-username`,
 *             gmailPassword: `your-gmail-app-pass`,
 *             edunexBearer: `your-edunex-api-bearer`,
 *             telegramToken: `your-telegram-bot-token`,
 *             discordToken: `your-discord-bot-token`,
 *             discordWebhook: `your-discord-webhook-url`,
 *             defaultUsers: {
 *                 telegramUserId: `your-telegram-user-id`,
 *                 gmailUsername: `your-gmail-username`,
 *                 discordUserId: `your-discord-user-id`,
 *                 webhookURL: `your-webhook-url`,
 *             },
 *         });
 *         await Roga.start();
 *         console.log(`RogaBot sukses berjalan!`);
 *     } catch (error) {
 *         console.error(`Gagal menjalankan inisialisasi RogaClient:`, error);
 *     }
 * ```
 *
 * @class **RogaClient**
 * @author `ZulfaNurhuda.` — My Developer
 */
class RogaClient {
    /**
     * @constructor Initializes the default properties of the RogaClient.
     */
    constructor() {
        /**
         * The email client instance.
         * @type {Mailer}
         */
        this.gmailClient = null;

        /**
         * The Telegram bot client instance.
         * @type {Telegram}
         */
        this.telegramClient = null;

        /**
         * The Discord bot client instance.
         * @type {Discord.Client}
         */
        this.discordClient = null;

        /**
         * The Discord webhook client instance.
         * @type {Discord.WebhookClient}
         */
        this.webhookClient = null;

        /**
         * The bot's configuration.
         * @type {RogaTypes.RogaConfigurations}
         */
        this.config = null;

        /**
         * The bot's active status.
         * @type {boolean}
         */
        this.isActive = true;
    }

    /**
     * Connects to the MongoDB database.
     * @param {RogaTypes.DatabaseCredentials} options The database credentials.
     * @returns {Promise<void>}
     * @throws {RogaError}
     */
    async #connectDatabase(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi connectDatabase() harus berupa objek yang valid.`
            );
        }

        const { mongoURI } = options;

        if (!mongoURI || typeof mongoURI !== `string` || !mongoURI.trim()) {
            throw new RogaError(`URI MongoDB tidak valid.`);
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang menghubungkan dengan database. [${new Date()}] `
            )
        );

        try {
            await database(mongoURI);

            mongoose.connection.on(`connected`, async () => {
                console.log(
                    chalk.bgGreen.whiteBright(
                        ` ✔️ | Terhubung dengan database. [${new Date()}] `
                    )
                );
                this.isActive = true;

                await this.#edunexHandler({
                    bearer: this.config.edunexBearer,
                    client: this,
                });
                setInterval(async () => {
                    await this.#edunexHandler({
                        bearer: this.config.edunexBearer,
                        client: this,
                    });
                }, this.config.edunexHandlerInterval);
            });

            mongoose.connection.on(`disconnected`, () => {
                console.log(
                    chalk.bgGreen.whiteBright(
                        ` ❌ | Koneksi dengan database terputus. [${new Date()}] `
                    )
                );
                this.isActive = false;
            });

            mongoose.connection.on(`error`, (error) => {
                console.log(
                    chalk.bgGreen.whiteBright(
                        ` ❌ | Koneksi dengan database error. [${new Date()}] `
                    )
                );
                this.isActive = false;
            });
        } catch (error) {
            throw new RogaError(error.message || error);
        }
    }

    /**
     * Connects to the Gmail SMTP server.
     * @param {RogaTypes.GmailCredentials} options The Gmail credentials.
     * @returns {Promise<Mailer>}
     * @throws {RogaError}
     */
    async #connectEmail(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi connectEmail() harus berupa objek yang valid.`
            );
        }

        const { username, password } = options;

        if (!username || typeof username !== `string` || !username.trim()) {
            throw new RogaError(`Username Gmail tidak valid.`);
        }

        if (!password || typeof password !== `string` || !password.trim()) {
            throw new RogaError(`Password Gmail tidak valid.`);
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang menghubungkan dengan Gmail client. [${new Date()}] `
            )
        );

        try {
            this.gmailClient = nodemailer.createTransport({
                host: `smtp.gmail.com`,
                port: 587,
                secure: false,
                auth: { user: username, pass: password },
            });
        } catch (error) {
            throw new RogaError(error.message || error);
        }

        await this.gmailClient.verify();
        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | Terhubung dengan Gmail client. [${new Date()}] `
            )
        );

        return this.gmailClient;
    }

    /**
     * Connects to the Telegram bot.
     * @param {RogaTypes.TelegramBotCredentials} options The Telegram bot credentials.
     * @returns {Promise<Telegram>}
     * @throws {RogaError}
     */
    async #connectTelegramBot(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi connectTelegramBot() harus berupa objek yang valid.`
            );
        }

        const { token } = options;

        if (!token || typeof token !== `string` || !token.trim()) {
            throw new RogaError(`Token bot Telegram tidak valid.`);
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang menghubungkan dengan Telegram client. [${new Date()}] `
            )
        );

        try {
            this.telegramClient = new Telegram(token, { polling: true });
        } catch (error) {
            throw new RogaError(error.message || error);
        }

        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | Terhubung dengan Telegram client. [${new Date()}] `
            )
        );
        return this.telegramClient;
    }

    /**
     * Connects to the Discord bot.
     * @param {RogaTypes.DiscordBotCredentials} options The Discord bot credentials.
     * @returns {Promise<Discord.Client>}
     * @throws {RogaError}
     */
    async #connectDiscordBot(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi connectDiscordBot() harus berupa objek yang valid.`
            );
        }

        const { token } = options;

        if (!token || typeof token !== `string` || !token.trim()) {
            throw new RogaError(`Token bot Discord tidak valid.`);
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang menghubungkan dengan Discord bot client. [${new Date()}] `
            )
        );

        try {
            this.discordClient = new Discord.Client({
                intents: [
                    Discord.Intents.FLAGS.DIRECT_MESSAGES,
                    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
                    Discord.Intents.FLAGS.GUILDS,
                    Discord.Intents.FLAGS.GUILD_BANS,
                    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
                    Discord.Intents.FLAGS.GUILD_INVITES,
                    Discord.Intents.FLAGS.GUILD_MEMBERS,
                    Discord.Intents.FLAGS.GUILD_MESSAGES,
                    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
                    Discord.Intents.FLAGS.GUILD_PRESENCES,
                    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
                    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
                    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
                ],
                partials: [
                    `MESSAGE`,
                    `REACTION`,
                    `USER`,
                    `CHANNEL`,
                    `GUILD_MEMBER`,
                ],
            });
            await this.discordClient.login(token);
        } catch (error) {
            throw new RogaError(error.message || error);
        }

        this.discordClient.on(`ready`, () => {
            console.log(
                chalk.bgGreen.whiteBright(
                    ` ✔️ | Terhubung dengan Discord bot client. [${new Date()}] `
                )
            );
        });

        this.discordClient.on(`error`, (error) => {
            throw new RogaError(error.message || error);
        });

        return this.discordClient;
    }

    /**
     * Connects to the Discord webhook.
     * @param {RogaTypes.DiscordWebhookCredentials} options The Discord webhook credentials.
     * @returns {Promise<Discord.WebhookClient>}
     * @throws {RogaError}
     */
    async #connectDiscordWebhook(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi connectDiscordWebhook() harus berupa objek yang valid.`
            );
        }

        const { url } = options;

        if (!url || typeof url !== `string` || !url.trim()) {
            throw new RogaError(`URL Webhook Discord tidak valid.`);
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang menghubungkan dengan Discord webhook. [${new Date()}] `
            )
        );

        try {
            this.webhookClient = new Discord.WebhookClient({ url });
        } catch (error) {
            throw new RogaError(error.message || error);
        }

        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | Terhubung dengan Discord webhook. [${new Date()}] `
            )
        );
        return this.webhookClient;
    }

    /**
     * Retries a function a given number of times.
     * @param {Function} fn The function to retry.
     * @param {number} retries The number of retries.
     * @param {number} delay The delay between retries.
     * @returns {Promise<any>}
     * @throws {any}
     */
    async #withRetry(fn, retries = 3, delay = 1000) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.#withRetry(fn, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    async #edunexHandler(options) {
        if (!options || typeof options !== `object`) {
            throw new RogaError(
                `Opsi edunexHandler() harus berupa objek yang valid.`
            );
        }

        const { bearer, client } = options;

        if (!bearer || typeof bearer !== `string` || !bearer.trim()) {
            throw new RogaError(
                `Bearer token tidak valid. Harus berupa string yang tidak kosong.`
            );
        }

        if (!client || !(client instanceof RogaClient)) {
            throw new RogaError(
                `Client tidak valid. Harus instance dari RogaClient.`
            );
        }

        try {
            await this.#withRetry(async () => {
                await edunexHandler({ bearer, client });
            });
        } catch (error) {
            throw new RogaError(error.message || error);
        }
    }

    /**
     * Sets the bot's active status.
     * @param {RogaTypes.RogaActiveStatus} status The new status.
     * @returns {Promise<boolean>}
     * @throws {RogaError}
     */
    async setStatus(status) {
        if (
            typeof status !== `string` ||
            ![`active`, `inactive`].includes(status.toLowerCase())
        ) {
            throw new RogaError(
                `Status tidak valid. Gunakan "active" atau "inactive".`
            );
        }

        this.isActive = status.toLowerCase() === `active`;
        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | RogaClient saat ini berstatus ${status}. [${new Date()}] `
            )
        );
        return this.isActive;
    }

    /**
     * Loads the bot's configuration.
     * @param {RogaTypes.RogaConfigurations} config The configuration object.
     * @returns {Promise<RogaTypes.RogaConfigurations>}
     * @throws {RogaError}
     */
    async loadConfig(config) {
        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang memuat konfigurasi. [${new Date()}] `
            )
        );

        if (!config || typeof config !== `object`) {
            throw new RogaError(
                `Opsi loadConfig() harus berupa objek yang valid.`
            );
        }

        if (
            !config.mongoURI ||
            typeof config.mongoURI !== `string` ||
            !config.mongoURI.trim()
        ) {
            throw new RogaError(
                `mongoURI tidak valid atau kosong. MongoURI wajib ada disetiap loadConfig() untuk terhubung dengan database.`
            );
        }

        if (
            !config.edunexBearer ||
            typeof config.edunexBearer !== `string` ||
            !config.edunexBearer.trim()
        ) {
            throw new RogaError(
                `edunexBearer tidak valid atau kosong. Bearer wajib ada disetiap loadConfig() untuk terhubung dengan database.`
            );
        }

        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | Konfigurasi berhasil dimuat. [${new Date()}] `
            )
        );

        this.config = config;
        return this.config;
    }

    /**
     * Starts the bot.
     * @returns {Promise<RogaTypes.StartReturnedData>}
     * @throws {RogaError}
     */
    async start() {
        if (!this.config) {
            throw new RogaError(
                `Konfigurasi belum dimuat. Panggil loadConfig() terlebih dahulu.`
            );
        }

        console.log(
            chalk.bgYellow.whiteBright(
                ` ⚠️ | Sedang memulai inisialisasi RogaClient. [${new Date()}] `
            )
        );

        /**
         * Data semua client yang di inisialisasi.
         * @type {RogaTypes.StartReturnedData}
         */
        const data = {};

        try {
            this.#connectDatabase({ mongoURI: this.config.mongoURI });
            if (this.config.gmailAppUsername && this.config.gmailAppPassword) {
                this.#connectEmail({
                    username: this.config.gmailAppUsername,
                    password: this.config.gmailAppPassword,
                });
                Object.assign(data, { gmailClient: this.gmailClient });
            }
            if (this.config.telegramBotToken) {
                this.#connectTelegramBot({ token: this.config.telegramBotToken });
                Object.assign(data, { telegramClient: this.telegramClient });
            }
            if (this.config.discordBotToken) {
                this.#connectDiscordBot({ token: this.config.discordBotToken });
                Object.assign(data, { discordClient: this.discordClient });
            }
            if (this.config.discordWebhookUrl) {
                this.#connectDiscordWebhook({
                    url: this.config.discordWebhookUrl,
                });
                Object.assign(data, { webhookClient: this.webhookClient });
            }
        } catch (error) {
            throw new RogaError(error.message || error);
        }

        console.log(
            chalk.bgGreen.whiteBright(
                ` ✔️ | Inisialisasi Berhasil. [${new Date()}] `
            )
        );
        return data;
    }
}

module.exports = RogaClient;
