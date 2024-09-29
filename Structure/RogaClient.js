/// Import Package
const Telegram = require(`node-telegram-bot-api`);
const Discord = require(`discord.js`);
const nodemailer = require(`nodemailer`);
const mongoose = require(`mongoose`)

/// Import Modules
const Mailer = require(`../node_modules/nodemailer/lib/mailer/index`);
const chalk = require(`chalk`);
const database = require(`../Utility/database`);
const edunex = require(`../Handler/edunexHandler/handler`);

class RogaClient {
    /**
     * @class RogaClient
     * @constructor
     * @param {Object} options Opsi Untuk Menjalankan RogaClient
     * @param {Array<String>} options.sendTo Platform Yang Akan Digunakan Untuk Memberi Notifikasi
     * @param {Object} options.token Objek Token
     * @param {String} [options.token.discord] Token Bot Discord
     * @param {String} [options.token.telegram] Token Bot Telegram
     * @param {Object} [options.token.email] Token Akun Gmail
     * @param {String} [options.token.email.username] Username Gmail
     * @param {String} [options.token.email.password] App Password Gmail
     */
    constructor(options) {
        /**
         * @type {Telegram} Objek Telegram Client
         */
        this.TelegramClient;

        /**
         * @type {Discord.Client<Boolean>} Objek Discord Client
         */
        this.DiscordClient;

        /**
         * @type {Mailer} Objek Email Client
         */
        this.emailClient;

        /**
         * @typedef {Object} SendTo Objek Data Pengiriman Notifikasi Edunex
         * @property {Boolean} telegram Kirim Ke Telegram?
         * @property {Boolean} discord Kirim Ke Discord?
         * @property {Boolean} email Kirim Ke Email?
         */
        /**
         * @type {SendTo} Data Pengiriman Notifikasi Edunex
         */
        this.sendTo = {
            telegram: false,
            discord: false,
            email: false,
        };

        options.sendTo.forEach((sendTo) => {
            const media = [`telegram`, `discord`, `email`];
            if (media.includes(sendTo.toLowerCase())) {
                this.sendTo[sendTo.toLowerCase()] = true;
                if (this.sendTo.telegram) {
                    if (!options.token.telegram) {
                        throw new Error(
                            `Silahkan Masukkan Token Telegram Terlebih Dahulu`
                        );
                    } else {
                        this.#connectBotTelegram(options.token.telegram);
                    }
                }
                if (this.sendTo.discord) {
                    if (!options.token.discord) {
                        throw new Error(
                            `Silahkan Masukkan Token Discord Terlebih Dahulu`
                        );
                    } else {
                        this.#connectBotDiscord(options.token.discord);
                    }
                }
                if (this.sendTo.email) {
                    if (
                        !options.token.email?.username ||
                        !options.token.email?.password
                    ) {
                        throw new Error(
                            `Silahkan Masukkan Username dan Password Email Terlebih Dahulu`
                        );
                    } else {
                        this.emailClient = nodemailer.createTransport({
                            host: `smtp.gmail.com`,
                            port: 587,
                            secure: false,
                            auth: {
                                user: options.token.email.username,
                                pass: options.token.email.password,
                            },
                        });
                    }
                }
                console.log(
                    chalk.bgGreen.bold.white(
                        ` V | Media Pengiriman Melalui ${sendTo} Berhasil Dimuat `
                    )
                );
            }
        });
    }

    /**
     * **Connect Database Method | RogaBot © 2024 - ZulfaNurhuda.**
     * ```js
     * Method Yang Digunakan Untuk Terhubung Dengan Database Dari MongoDB
     * ```
     * @param {String} token Mongo URI Untuk Terhubung Dengan MongoDB
     * @returns {Promise<mongoose>} `Promise<mongoose>` — Database Terhubung
     * @author `ZulfaNurhuda.` — My Developer
     */
    async connectDatabase(token) {
        const connect = await database(token).then((data) => data).catch((e) => {
            throw new Error(e);
        });
        return connect;
    }

    /**
     * **Connect Bot Telegram Method | RogaBot © 2024 - ZulfaNurhuda.**
     * ```js
     * Method Yang Digunakan Untuk Terhubung Dengan Bot Telegram
     * ```
     * @param {String} token Token Bot Telegram
     * @returns {Promise<Telegram>} `Promise<Telegram>` — Bot Telegram Terhubung
     * @author `ZulfaNurhuda.` — My Developer
     */
    async #connectBotTelegram(token) {
        let TelegramClient;

        try {
            TelegramClient = new Telegram(token);
        } catch (e) {
            throw new Error(e);
        }

        this.TelegramClient = TelegramClient;
        return TelegramClient;
    }

    /**
     * **Connect Bot Discord Method | RogaBot © 2024 - ZulfaNurhuda.**
     * ```js
     * Method Yang Digunakan Untuk Terhubung Dengan Bot Discord
     * ```
     * @param {String} token Token Bot Discord
     * @returns {Promise<Discord.Client>} `Promise<Discord.Client>` — Bot Discord Terhubung
     * @author `ZulfaNurhuda.` — My Developer
     */
    async #connectBotDiscord(token) {
        const DiscordClient = new Discord.Client({
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
        DiscordClient.login(token).catch((e) => {
            throw new Error(e);
        });
        this.DiscordClient = DiscordClient;
        return DiscordClient;
    }

    /**
     * **Edunex Handler Method | RogaBot © 2024 - ZulfaNurhuda.**
     * ```js
     * Handler Yang Digunakan Untuk Terhubung Dengan Edunex Learning Management System Milik Institut Teknologi Bandung
     * ```
     * @param {Object} options Opsi Untuk Edunex Handler
     * @param {String} options.bearer Bearer Untuk Auth Edunex API
     * @param {RogaClient} options.client Objek RogaClient
     * @returns {Promise<void>} `Promise<void>` — Edunex Handler Executed
     * @author `ZulfaNurhuda.` — My Developer
     */
    async edunexHandler(options) {
        const connect = await edunex({
            bearer: options.bearer,
            client: options.client,
        }).catch((e) => {
            throw new Error(e);
        });
        return connect;
    }
}

module.exports = RogaClient;
