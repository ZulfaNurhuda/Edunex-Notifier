/// Import Packages
const fs = require(`fs`);
const path = require(`path`);
const chalk = require(`chalk`);

/// Import Structures
const RogaError = require(`../../structures/RogaError.js`);

/// Import Types
const RogaTypes = require(`../../types/types.js`);

/// Import Service
const sendEmail = require(`./sendEmail.js`);
const sendTelegram = require(`./sendMessageTelegram.js`);
const sendWebhook = require(`./sendDiscordWebhook.js`);

/**
 * ## **_capitalizeFirstLetter_ Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini digunakan untuk mengubah huruf pertama dari sebuah string menjadi huruf kapital,
 * sehingga mempermudah penyesuaian format teks pada aplikasi.
 *
 * ### Informasi Tambahan:
 * - Pastikan input `str` adalah string yang valid untuk menghindari error.
 * - Fungsi ini umum digunakan untuk mengubah kata kunci atau label menjadi format yang lebih profesional dan terstruktur.
 * - Jika parameter bukan string, fungsi akan melempar error untuk memudahkan debugging.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const word = `assignment`;
 * const capitalizedWord = capitalizeFirstLetter(word); // Output: `Assignment`
 * ```
 *
 * @param {string} str - String yang akan diubah huruf pertamanya menjadi kapital.
 * @returns {string} String yang telah diubah, dengan huruf pertama menjadi kapital.
 * @throws {RogaError} Jika parameter `str` tidak valid atau bukan string, akan melemparkan error.
 * @author `ZulfaNurhuda.` — My Developer
 */
function capitalizeFirstLetter(str) {
    if (!str || typeof str !== `string`) {
        throw new RogaError(`Parameter harus berupa string yang valid.`);
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * **Variabel untuk Menampung Semua Template File**
 * @type {RogaTypes.TemplateFile}: Tipe data yang merepresentasikan semua template file.
 */
const templateFile = {};

/**
 * ## **_loadTemplates_ Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini memuat semua template untuk keperluan assignment dan ujian secara asinkron
 * dari berbagai platform (email, telegram, webhook). Berguna untuk memastikan semua
 * platform memiliki akses ke template yang sesuai.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini bekerja secara asinkron, sehingga harus ditangani dengan `await` atau `then`.
 * - Menggunakan format file yang berbeda-beda tergantung pada platform (email: html, telegram: txt, webhook: json).
 * - File template disimpan dalam direktori `src/templates`, dan masing-masing file memiliki ekstensi yang sesuai berdasarkan platform.
 * - Jika terjadi kesalahan saat membaca file, fungsi akan melemparkan kesalahan dengan tipe `RogaError` untuk memudahkan proses debugging.
 *
 * ### Contoh Penggunaan:
 * ```js
 * try {
 *     await loadTemplates();
 *     console.log(templateFile[`assignment`][`email`]); // Output: Template HTML untuk email assignment
 * } catch (error) {
 *     console.error(`Gagal memuat template:`, error);
 * }
 * ```
 *
 * @returns {Promise<void>} Mengisi `templateFile` dengan data dari setiap template yang tersedia.
 * @throws {RogaError} Mengembalikan kesalahan jika terjadi kegagalan saat membaca file.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function loadTemplates() {
    const types = [`assignment`, `exam`];
    const platforms = [`email`, `telegram`, `webhook`];

    const extensionMap = {
        email: `html`,
        telegram: `txt`,
        webhook: `json`,
    };

    for (const type of types) {
        templateFile[type] = {};

        for (const platform of platforms) {
            const ext = extensionMap[platform];
            const filePath = path.join(
                process.cwd(),
                `src`,
                `templates`,
                type,
                `messageTemplate${capitalizeFirstLetter(type)}.${ext}`
            );

            try {
                const content = await fs.promises.readFile(filePath, `utf8`);
                templateFile[type][platform] = content;
            } catch (error) {
                throw new RogaError(error.message || error);
            }
        }
    }
}

/**
 * **_replacerVariable_ Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini menggantikan variabel placeholder dalam template dengan nilai yang diberikan
 * dalam `options.message`. Digunakan untuk menyesuaikan konten template berdasarkan data
 * yang disediakan oleh pengguna.
 *
 * ### Informasi Tambahan:
 * - Template yang digunakan diambil dari `templateFile` berdasarkan `type` dan `platform`
 *   yang diberikan dalam `options`.
 * - Placeholder variabel dalam template mengikuti format `$variable`, dan akan digantikan
 *   oleh nilai yang sesuai dari `options.message`.
 * - Jika template untuk `type` dan `platform` yang diminta tidak ditemukan, atau jika
 *   variabel yang diperlukan tidak tersedia dalam `options.message`, fungsi akan melemparkan
 *   kesalahan dengan tipe `RogaError`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     type: `assignment`,
 *     platform: `email`,
 *     message: {
 *         nama_dosen: `Untung Triadhi`,
 *         mata_kuliah: `Kimia Asyik`,
 *         ... dll
 *     }
 * };
 *
 * const result = replacerVariable(options);
 * // Input: `Halo $nama_dosen, selamat datang di $mata_kuliah!`
 * // Output: Template dengan variabel digantikan, misalnya `Halo Untung Triadhi, selamat datang di Kimia Asyik!`
 * ```
 *
 * @function replacerVariable
 * @param {RogaTypes.ReplacerOptions} options - Opsi untuk menggantikan variabel dalam template.
 * @returns {string} Template dengan variabel yang telah digantikan sesuai data dalam `options.message`.
 * @throws {RogaError} Mengembalikan kesalahan jika template tidak ditemukan atau jika variabel dalam `options.message` tidak lengkap.
 * @author `ZulfaNurhuda.` - My Developer
 */
function replacerVariable(options) {
    let data = templateFile[options.type][options.platform];
    if (!data) {
        throw new RogaError(
            `Template untuk type: ${options.type} dan platform: ${options.platform} tidak ditemukan.`
        );
    }

    return data.replace(/\$(\w+)/g, (_, kata) => {
        if (options.message[kata] === undefined) {
            throw new RogaError(
                `Parameter ${kata} belum dimasukkan ke dalam options.message!`
            );
        }
        return options.message[kata];
    });
}

/**
 * **_sendData_ Local Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi ini mengirimkan data berdasarkan jenis (`type`) dan platform yang ditentukan dalam `options`.
 * Fungsi ini pertama kali memuat template yang diperlukan, kemudian menggantikan variabel dalam
 * template sesuai `options.message`, dan mengirimkan pesan melalui platform yang diaktifkan di `client`.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini mendukung berbagai platform seperti Gmail, Telegram, dan Webhook.
 * - Platform yang diaktifkan ditentukan melalui `client`, di mana setiap platform memiliki
 *   client spesifik seperti `gmailClient` atau `telegramClient`.
 * - Setiap platform memiliki fungsi pengirim sendiri (`sendEmail`, `sendTelegram`, `sendWebhook`)
 *   yang dipanggil dengan pesan yang sudah disesuaikan.
 * - Jika terjadi kesalahan dalam proses penggantian variabel atau pengiriman pesan, fungsi ini
 *   akan melempar kesalahan `RogaError`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: RogaClient,
 *     message: {
 *         nama_dosen: `Untung Triadhi`,
 *         mata_kuliah: `Kimia Asyik`,
 *         ... dll
 *     }
 * };
 * await sendData(`exam`, options);
 * ```
 *
 * @param {string} type Jenis data yang akan dikirim (`assignment` atau `exam`).
 * @param {RogaTypes.SendDataAssignment|RogaTypes.SendDataExam} options Opsi untuk pengiriman data.
 * @returns {Promise<void>} Mengirim pesan ke platform yang tersedia berdasarkan konfigurasi `client`.
 * @throws {RogaError} Mengembalikan kesalahan jika terjadi kegagalan dalam penggantian variabel atau pengiriman pesan.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function sendData(type, options) {
    if (!type || ![`assignment`, `exam`].includes(type)) {
        throw new RogaError(
            `Parameter type harus berupa string yang valid (antara "assignment" atau "exam").`
        );
    }

    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, message } = options;

    if (!client || !(client instanceof RogaClient)) {
        return new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (typeof message !== `object`) {
        throw new RogaError(
            `Message yang akan dikirim harus berupa objek (AssignmentMessageDetails atau ExamMessageDetails).`
        );
    }

    try {
        await loadTemplates();
    } catch (error) {
        throw new RogaError(error.message || error);
    }

    const platforms = [
        {
            name: `gmail`,
            to: client.config.defaultUsers?.gmailUsername,
            sender: sendEmail,
            typeKey: type,
        },
        {
            name: `telegram`,
            to: client.config.defaultUsers?.telegramUserId,
            sender: sendTelegram,
            typeKey: type,
        },
        {
            name: `webhook`,
            to: client.config.defaultUsers?.webhookURL,
            sender: sendWebhook,
            typeKey: type,
        },
        //{ name: `discord`, config: client.config.defaultUsers?.discordUserId, sender: sendDiscord, typeKey: type },
    ];

    for (const platform of platforms) {
        if (client[platform.name + `Client`] && platform.to) {
            console.log(
                chalk.bgGreen.whiteBright(
                    ` ✔️ | Distribusi pesan ${
                        platform.typeKey
                    } melalui media ${capitalizeFirstLetter(
                        platform.name
                    )} sedang berlangsung. [${new Date()}] `
                )
            );
            try {
                const replacedMessage = replacerVariable({
                    type,
                    platform: platform.name,
                    message,
                });

                const sendOptions = {
                    client,
                    url_edunex: message.url_edunex,
                    message: replacedMessage,
                };
                await platform.sender(sendOptions);
                console.log(
                    chalk.bgGreen.whiteBright(
                        ` ✔️ | Distribusi pesan ${
                            platform.typeKey
                        } melalui media ${capitalizeFirstLetter(
                            platform.name
                        )} sukses. [${new Date()}] `
                    )
                );
            } catch (error) {
                throw new RogaError(error.message || error);
            }
        }
    }
}

/**
 * **_examData_ Service Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi pembantu yang secara spesifik digunakan untuk mengirim data tipe `exam`. Fungsi ini memanggil `sendData`
 * dengan `type` diset ke `exam` dan menangani error jika terjadi selama pengiriman.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini hanya berlaku untuk data jenis ujian (`exam`).
 * - Error yang terjadi akan ditangkap dan dilempar ulang sebagai `RogaError`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: { gmailClient: true, telegramClient: false },
 *     message: {
 *         nama_dosen: `Untung Triadhi`,
 *         mata_kuliah: `Kimia Asyik`,
 *         ... dll
 *     }
 * };
 * await examData(options);
 * ```
 *
 * @param {RogaTypes.SendDataExam} options Opsi yang akan diteruskan ke fungsi `sendData`.
 * @returns {Promise<void>} Mengirim data ujian ke platform yang tersedia.
 * @throws {RogaError} Mengembalikan kesalahan jika terjadi kegagalan dalam pengiriman pesan.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function examData(options) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, message } = options;

    if (!client || !(client instanceof RogaClient)) {
        return new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (typeof message !== `object`) {
        throw new RogaError(
            `Message yang akan dikirim harus berupa objek (ExamMessageDetails).`
        );
    }

    try {
        await sendData(`exam`, options);
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

/**
 * **_assignmentData_ Service Function | RogaBot © 2024 - ZulfaNurhuda.**
 *
 * Fungsi pembantu yang secara spesifik digunakan untuk mengirim data tipe `assignment`. Fungsi ini memanggil `sendData`
 * dengan `type` diset ke `assignment` dan menangani error jika terjadi selama pengiriman.
 *
 * ### Informasi Tambahan:
 * - Fungsi ini hanya berlaku untuk data jenis tugas (`assignment`).
 * - Error yang terjadi akan ditangkap dan dilempar ulang sebagai `RogaError`.
 *
 * ### Contoh Penggunaan:
 * ```js
 * const options = {
 *     client: { gmailClient: false, telegramClient: true },
 *     message: {
 *         nama_dosen: `Untung Triadhi`,
 *         mata_kuliah: `Kimia Asyik`,
 *         ... dll
 *     }
 * };
 * await assignmentData(options);
 * ```
 *
 * @param {RogaTypes.SendDataAssignment} options - Opsi yang akan diteruskan ke fungsi `sendData`.
 * @returns {Promise<void>} Mengirim data tugas ke platform yang tersedia.
 * @throws {RogaError} Mengembalikan kesalahan jika terjadi kegagalan dalam pengiriman pesan.
 * @author `ZulfaNurhuda.` — My Developer
 */
async function assignmentData(options) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { client, message } = options;

    if (!client || !(client instanceof RogaClient)) {
        return new RogaError(
            `Client tidak valid. Harus instance dari RogaClient.`
        );
    }

    if (typeof message !== `object`) {
        throw new RogaError(
            `Message yang akan dikirim harus berupa objek (AssignmentMessageDetails).`
        );
    }

    try {
        await sendData(`assignment`, options);
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = { examData, assignmentData };
