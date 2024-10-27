/// Import Types
const RogaTypes = require(`../types/types`);

/**
 * ## **Configurations Files | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * File ini berisi konfigurasi yang digunakan untuk menginisialisasi dan mengonfigurasi klien RogaBot. Semua informasi yang diperlukan untuk menghubungkan bot ke berbagai layanan (seperti MongoDB, Gmail, Edunex, Telegram, dan Discord) disimpan di sini.
 *
 * ### Informasi Tambahan:
 * - Setiap konfigurasi ditarik dari variabel lingkungan (`process.env`), sehingga penting untuk memastikan bahwa variabel lingkungan ini telah diatur dengan benar dalam file `.env` atau lingkungan yang sesuai.
 * - `mongoURI` adalah URI untuk menghubungkan bot ke database MongoDB, yang berperan penting dalam penyimpanan data bot.
 * - `gmailUsername` dan `gmailPassword` digunakan untuk mengautentikasi dengan server Gmail untuk pengiriman email notifikasi.
 * - `edunexBearer` adalah token autentikasi yang digunakan untuk mengakses API Edunex.
 * - `telegramToken` dan `discordToken` adalah token yang diperlukan untuk menghubungkan bot dengan platform Telegram dan Discord.
 * - `defaultUsers` mencakup informasi pengguna default yang akan diberitahu jika terjadi kesalahan pada layanan tertentu (seperti Edunex).
 * - Pastikan `emailToNotifyEdunexError` diatur ke alamat email yang valid, karena ini akan menjadi tujuan notifikasi kesalahan.
 *
 * ### Contoh Pengaturan:
 * Di dalam file `.env`, pastikan variabel-variabel berikut sudah terisi dengan benar:
 *
 * ```bash
 * MONGO_URI=mongodb://localhost:27017/yourdatabase
 * GMAIL_APP_USERNAME=yourgmail@gmail.com
 * GMAIL_APP_PASS=yourgmailpassword
 * EDUNEX_BEARER=youredunextoken
 * TELEGRAM_BOT_TOKEN=yourtelegramtoken
 * DISCORD_BOT_TOKEN=yourdiscordtoken
 * DISCORD_WEBHOOK=yourdiscordwebhookurl
 * ```
 *
 * @type {RogaTypes.RogaConfigurations}: Tipe yang merepresentasikan objek konfigurasi yang akan dimuat ke dalam klien RogaBot.
 * @author `ZulfaNurhuda.` — My Developer
 */
const configurations = {
    mongoURI: process.env.MONGO_URI,
    gmailUsername: process.env.GMAIL_APP_USERNAME,
    gmailPassword: process.env.GMAIL_APP_PASS,
    edunexBearer: process.env.EDUNEX_BEARER,
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    discordToken: process.env.DISCORD_BOT_TOKEN,
    discordWebhook: process.env.DISCORD_WEBHOOK,
    defaultUsers: {
        webhookURL: process.env.DISCORD_WEBHOOK,
    },
};

module.exports = configurations;
