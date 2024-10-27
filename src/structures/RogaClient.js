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
     * @constructor Menginisialisasi properti default RogaClient.
     */
    constructor() {
        /**
         * **Menyimpan instance klien email.**
         * @type {Mailer}: Tipe data yang merepresentasikan client Mailer nodemailer.
         */
        this.gmailClient = null;

        /**
         * **Menyimpan instance klien bot Telegram.**
         * @type {Telegram}: Tipe data yang merepresentasikan client Telegram bot.
         */
        this.telegramClient = null;

        /**
         * **Menyimpan instance klien bot Discord.**
         * @type {Discord.Client}: Tipe data yang merepresentasikan client Discord bot.
         */
        this.discordClient = null;

        /**
         * **Menyimpan instance klien webhook Discord.**
         * @type {Discord.WebhookClient}: Tipe data yang merepresentasikan client Discord webhook.
         */
        this.webhookClient = null;

        /**
         * **Menyimpan konfigurasi bot.**
         * @type {RogaTypes.RogaConfigurations}: Tipe data yang merepresentasikan konfigurasi RogaClient.
         */
        this.config = null;

        /**
         * Status aktif bot.
         * @type {boolean}: Tipe data yang merepresentasikan status bot. Menunjukkan `true` jika aktif, `false` jika tidak.
         */
        this.isActive = true;
    }

    /**
     * ## **_#connectDatabase_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini digunakan untuk menghubungkan `RogaClient` dengan basis data MongoDB. Jika koneksi berhasil, fungsi akan memulai pengelolaan koneksi dan menjalankan `#edunexHandler` untuk memperbarui data sesuai interval waktu yang ditentukan. Jika koneksi gagal, fungsi akan melempar error dan bot otomatis menonaktifkan status aktif.
     *
     * ### Informasi Tambahan:
     * - Pastikan opsi `mongoURI` valid dan tersedia sebelum memanggil fungsi ini.
     * - Event listener `connected`, `disconnected`, dan `error` ditambahkan untuk memantau status koneksi MongoDB.
     * - Ketika koneksi berhasil, handler Edunex akan dijalankan pertama kali dan diulang setiap 5 menit untuk memperbarui data.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     mongoURI: `your-mongo-uri`,
     * };
     * await #connectDatabase(options);
     * ```
     *
     * @param {RogaTypes.DatabaseCredentials} options Konfigurasi kredensial database, termasuk `mongoURI` sebagai URI untuk koneksi MongoDB.
     * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menunjukkan bahwa koneksi database berhasil dibuat.
     * @throws {RogaError} Jika terjadi kesalahan saat menghubungkan ke database atau opsi `mongoURI` tidak valid.
     * @author `ZulfaNurhuda.` — My Developer
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
                }, 1000 * 60 * 5);
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
     * ## **_#connectEmail_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini menghubungkan `RogaClient` ke akun Gmail menggunakan kredensial yang diberikan. Setelah terhubung, fungsi menginisialisasi klien Gmail dengan konfigurasi SMTP yang sesuai. Jika kredensial salah atau koneksi gagal, fungsi akan melempar error.
     *
     * ### Informasi Tambahan:
     * - Pastikan opsi `username` dan `password` sudah valid sebelum memanggil fungsi ini.
     * - Fungsi ini mengandalkan protokol SMTP Gmail untuk melakukan otentikasi dan verifikasi klien.
     * - Ketika koneksi berhasil, instance klien Gmail siap digunakan untuk pengiriman notifikasi dan email otomatis.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     username: `your-gmail-username`,
     *     password: `your-gmail-password`,
     * };
     * await #connectEmail(options);
     * ```
     *
     * @param {RogaTypes.GmailCredentials} options Konfigurasi kredensial Gmail, termasuk `username` sebagai nama pengguna Gmail dan `password` sebagai sandi aplikasi Gmail.
     * @returns {Promise<Mailer>} Mengembalikan instance klien Gmail yang siap digunakan.
     * @throws {RogaError} Jika terjadi kesalahan dalam koneksi ke Gmail atau kredensial tidak valid.
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
     * ## **_#connectTelegramBot_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini menghubungkan `RogaClient` ke bot Telegram menggunakan token autentikasi yang diberikan. Setelah berhasil, klien bot Telegram siap menerima dan mengirimkan pesan melalui polling. Jika token salah atau koneksi gagal, fungsi akan melempar error.
     *
     * ### Informasi Tambahan:
     * - Token bot Telegram harus valid dan terkait dengan akun bot Telegram aktif.
     * - Fungsi ini menggunakan opsi polling untuk mendengarkan pesan masuk secara real-time.
     * - Koneksi ini memungkinkan RogaBot mengirimkan notifikasi dan menerima perintah melalui Telegram.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     token: `your-telegram-bot-token`,
     * };
     * await #connectTelegramBot(options);
     * ```
     *
     * @param {RogaTypes.TelegramBotCredentials} options Konfigurasi kredensial Telegram, termasuk `token` yang diperlukan untuk mengautentikasi bot.
     * @returns {Promise<Telegram>} Mengembalikan instance klien Telegram yang siap digunakan untuk komunikasi bot.
     * @throws {RogaError} Jika terjadi kesalahan dalam menghubungkan ke Telegram atau token tidak valid.
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
     * ## **_#connectDiscordBot_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini menghubungkan `RogaClient` ke bot Discord menggunakan token yang diberikan untuk autentikasi. Setelah berhasil, bot Discord siap beroperasi dengan berbagai intent dan partial yang diaktifkan untuk mengelola perintah dan interaksi server secara komprehensif.
     *
     * ### Informasi Tambahan:
     * - Token bot Discord harus valid dan sesuai dengan izin aplikasi Discord.
     * - Fungsi ini mengaktifkan berbagai intent dan partial yang diperlukan untuk mendengarkan pesan, reaksi, anggota guild, dan status guild.
     * - Saat koneksi berhasil, event listener `ready` diaktifkan untuk memberi notifikasi bahwa bot siap digunakan.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     token: `your-discord-bot-token`,
     * };
     * await #connectDiscordBot(options);
     * ```
     *
     * @param {RogaTypes.DiscordBotCredentials} options Konfigurasi kredensial Discord, termasuk `token` untuk mengautentikasi bot.
     * @returns {Promise<Discord.Client>} Mengembalikan instance klien Discord yang siap digunakan untuk komunikasi bot.
     * @throws {RogaError} Jika terjadi kesalahan dalam koneksi ke Discord atau token tidak valid.
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
     * ## **_#connectDiscordWebhook_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini menghubungkan `RogaClient` ke webhook Discord menggunakan URL yang diberikan. Setelah berhasil, klien webhook Discord siap untuk mengirim pesan notifikasi atau laporan error ke saluran yang ditentukan. Jika URL tidak valid atau koneksi gagal, fungsi akan melempar error.
     *
     * ### Informasi Tambahan:
     * - Pastikan URL webhook yang digunakan valid dan sudah dikonfigurasi pada server Discord yang benar.
     * - Webhook memungkinkan pengiriman pesan langsung ke saluran Discord tanpa kehadiran bot penuh.
     * - Saat koneksi berhasil, instance webhook siap digunakan untuk mengirim pesan otomatis dan notifikasi lainnya.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     url: `your-discord-webhook-url`,
     * };
     * await #connectDiscordWebhook(options);
     * ```
     *
     * @param {RogaTypes.DiscordWebhookCredentials} options Konfigurasi kredensial webhook Discord, termasuk `url` untuk autentikasi webhook.
     * @returns {Promise<Discord.WebhookClient>} Mengembalikan instance klien webhook Discord yang siap digunakan untuk komunikasi.
     * @throws {RogaError} Jika terjadi kesalahan dalam koneksi ke webhook Discord atau URL tidak valid.
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
     * ## **_#edunexHandler_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Handler ini digunakan untuk menghubungkan `RogaClient` dengan Edunex Learning Management System (LMS) milik Institut Teknologi Bandung. Fungsi ini berfungsi untuk mendapatkan data `todo` dari Edunex API dan memproses tugas serta ujian jika tersedia. Jika terjadi kesalahan selama proses, handler akan menonaktifkan client dan memanggil fungsi penanganan error Edunex.
     *
     * ### Informasi Tambahan:
     * - Pastikan bahwa `client` dalam status aktif sebelum memanggil handler ini.
     * - Fungsi ini menangani dua jenis data utama: tugas (assignment) dan ujian (exam) dari LMS.
     * - Jika terjadi kesalahan pada API Edunex, bot akan otomatis menonaktifkan `client`.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const options = {
     *     client: RogaClient,
     *     bearer: `your-edunex-api-bearer`,
     * };
     * await #edunexHandler(options);
     * ```
     *
     * @param {RogaTypes.EdunexHandlerOptions} options Opsi konfigurasi untuk menjalankan Edunex Handler, termasuk instance client dan token bearer untuk autentikasi.
     * @returns {Promise<void>} Mengembalikan `Promise<void>` yang menandakan handler berhasil dijalankan dan data dari API Edunex telah diproses.
     * @throws {RogaError} Jika terjadi kesalahan dalam memproses API atau jika respons Edunex menunjukkan adanya error.
     */
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
            await edunexHandler({ bearer, client });
        } catch (error) {
            throw new RogaError(error.message || error);
        }
    }

    /**
     * ## **_setStatus_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini digunakan untuk mengubah status aktif atau nonaktif `RogaClient` sesuai dengan status yang ditentukan. Jika status yang diberikan tidak valid, fungsi akan melempar error.
     *
     * ### Informasi Tambahan:
     * - Status yang diterima adalah `active` untuk mengaktifkan bot atau `inactive` untuk menonaktifkannya.
     * - Perubahan status akan mempengaruhi respons dan tindakan bot secara keseluruhan.
     * - Status bot akan tercetak di log setiap kali terjadi perubahan.
     *
     * ### Contoh Penggunaan:
     * ```js
     * await setStatus(`active`); // Mengaktifkan bot
     * await setStatus(`inactive`); // Menonaktifkan bot
     * ```
     *
     * @param {RogaTypes.RogaActiveStatus} status Status baru untuk bot, baik `active` maupun `inactive`.
     * @returns {Promise<boolean>} Mengembalikan `true` jika status berhasil diatur menjadi `active`, atau `false` jika `inactive`.
     * @throws {RogaError} Jika status yang diberikan tidak valid (bukan `active` atau `inactive`).
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
     * ## **_loadConfig_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini memuat konfigurasi awal `RogaClient`, yang mencakup pengaturan untuk koneksi database, API Edunex, dan layanan lainnya. Konfigurasi yang tidak valid atau kosong akan menyebabkan fungsi ini melempar error. Konfigurasi yang berhasil dimuat akan tersedia untuk digunakan oleh seluruh modul bot.
     *
     * ### Informasi Tambahan:
     * - `mongoURI` dan `edunexBearer` adalah parameter wajib untuk memuat konfigurasi ini dengan benar.
     * - Fungsi ini menginisialisasi konfigurasi dan mencetak log keberhasilan setelah berhasil memuatnya.
     * - Pastikan semua konfigurasi yang dibutuhkan sudah benar untuk menghindari error saat bot beroperasi.
     *
     * ### Contoh Penggunaan:
     * ```js
     * const config = {
     *     mongoURI: `your-mongo-uri`,
     *     gmailUsername: `your-gmail-username`,
     *     gmailPassword: `your-gmail-app-pass`,
     *     edunexBearer: `your-edunex-api-bearer`,
     *     telegramToken: `your-telegram-bot-token`,
     *     discordToken: `your-discord-bot-token`,
     *     discordWebhook: `your-discord-webhook-url`,
     *     defaultUsers: {
     *         telegramUserId: `your-telegram-user-id`,
     *         gmailUsername: `your-gmail-username`,
     *         discordUserId: `your-discord-user-id`,
     *         webhookURL: `your-webhook-url`,
     * };
     * await loadConfig(config);
     * ```
     *
     * @param {RogaTypes.RogaConfigurations} config Objek konfigurasi untuk `RogaClient`, berisi parameter yang diperlukan untuk berbagai layanan.
     * @returns {Promise<RogaTypes.RogaConfigurations>} Mengembalikan objek konfigurasi yang berhasil dimuat.
     * @throws {RogaError} Jika ada konfigurasi yang tidak valid atau parameter wajib kosong.
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
     * ## **_start_ Function | RogaBot © 2024 - ZulfaNurhuda**
     *
     * Fungsi ini memulai `RogaClient` dengan menghubungkan semua layanan yang dikonfigurasi, termasuk MongoDB, Gmail, Telegram, Discord, dan webhook Discord. Jika konfigurasi belum dimuat atau koneksi ke layanan gagal, fungsi ini akan melempar error.
     *
     * ### Informasi Tambahan:
     * - Pastikan `loadConfig()` telah dipanggil sebelumnya untuk menyediakan konfigurasi yang diperlukan.
     * - Fungsi ini menghubungkan ke layanan eksternal secara asinkron dan akan mencetak log status untuk setiap layanan yang berhasil diinisialisasi.
     * - Setiap koneksi klien akan disimpan dalam objek `data` dan dikembalikan saat proses selesai.
     *
     * ### Contoh Penggunaan:
     * ```js
     * await start(); // Memulai bot dan menghubungkan semua layanan
     * ```
     *
     * @returns {Promise<RogaTypes.StartReturnedData>} Mengembalikan objek berisi semua klien yang berhasil diinisialisasi dan terhubung.
     * @throws {RogaError} Jika konfigurasi belum dimuat atau terjadi kesalahan dalam menghubungkan layanan.
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
            if (this.config.gmailUsername && this.config.gmailPassword) {
                this.#connectEmail({
                    username: this.config.gmailUsername,
                    password: this.config.gmailPassword,
                });
                Object.assign(data, { gmailClient: this.gmailClient });
            }
            if (this.config.telegramToken) {
                this.#connectTelegramBot({ token: this.config.telegramToken });
                Object.assign(data, { telegramClient: this.telegramClient });
            }
            if (this.config.discordToken) {
                this.#connectDiscordBot({ token: this.config.discordToken });
                Object.assign(data, { discordClient: this.discordClient });
            }
            if (this.config.discordWebhook) {
                this.#connectDiscordWebhook({
                    url: this.config.discordWebhook,
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
