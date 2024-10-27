/**
 * ## **Assignment Template Data | RogaBot © 2024**
 *
 * Berisi properti-properti untuk template data tugas/assignment.
 *
 * ### Properti:
 * - **nama:** Nama tugas dari assignmentData.data.attributes.name
 * - **tanggal_mulai:** Tanggal dimulainya tugas (format LLLL)
 * - **deadline:** Tanggal deadline tugas (format LLLL)
 * - **tanggal_upload:** Tanggal upload tugas oleh dosen (format LLLL)
 * - **url_edunex:** URL Edunex untuk mengambil tugas
 *
 * @typedef {Object} AssignmentTemplateData
 * @property {string} nama - Nama tugas dari assignmentData.data.attributes.name
 * @property {string} tanggal_mulai - Tanggal dimulai tugas (format LLLL)
 * @property {string} deadline - Tanggal deadline tugas (format LLLL)
 * @property {string} tanggal_upload - Tanggal upload tugas (format LLLL)
 * @property {string} url_edunex - URL Edunex untuk mengambil tugas
 */

/**
 * ## **Template File | RogaBot © 2024**
 *
 * Berisi template untuk berbagai jenis konten dan platform.
 *
 * ### Properti:
 * - **assignment:** Template untuk tugas dengan format berbagai platform
 * - **exam:** Template untuk ujian dengan format berbagai platform
 *
 * @typedef {Object} TemplateFile
 * @property {PlatformTemplates} assignment - Template untuk tugas
 * @property {PlatformTemplates} exam - Template untuk ujian
 */

/**
 * ## **Platform Templates | RogaBot © 2024**
 *
 * Berisi template konten untuk berbagai platform.
 *
 * ### Format Template per Platform:
 * - **Email:** Format HTML
 * - **Telegram:** Format teks biasa
 * - **Webhook:** Format JSON
 *
 * @typedef {Object} PlatformTemplates
 * @property {string} email - Template konten format HTML
 * @property {string} telegram - Template konten format teks
 * @property {string} webhook - Template konten format JSON
 */

/**
 * ## **Send Discord Webhook Options | RogaBot © 2024**
 *
 * Opsi untuk mengirim webhook ke Discord.
 *
 * ### Properti:
 * - **client:** Instance RogaClient untuk Discord
 * - **message:** Konten pesan dalam format JSON
 *
 * @typedef {Object} SendDiscordWebhookOptions
 * @property {RogaClient} client - Instance RogaClient
 * @property {string} message - Konten pesan format JSON
 */

/**
 * ## **Send Gmail Options | RogaBot © 2024**
 *
 * Opsi untuk mengirim email melalui Gmail.
 *
 * ### Properti:
 * - **client:** Instance RogaClient untuk Gmail
 * - **message:** Konten email dalam format HTML
 *
 * @typedef {Object} SendGmailOptions
 * @property {RogaClient} client - Instance RogaClient
 * @property {string} message - Konten email format HTML
 */

/**
 * ## **Send Telegram Options | RogaBot © 2024**
 *
 * Opsi untuk mengirim pesan ke Telegram.
 *
 * ### Properti:
 * - **client:** Instance RogaClient untuk Telegram
 * - **message:** Konten pesan dalam format teks
 *
 * @typedef {Object} SendTelegramOptions
 * @property {RogaClient} client - Instance RogaClient
 * @property {string} message - Konten pesan format teks
 */

/**
 * ## **RogaClient Typedef | RogaBot © 2024**
 *
 * Tipe data utama dari kelas RogaClient.
 *
 * @typedef {RogaClient} RogaClient
 */

/**
 * ## **RogaActive Status | RogaBot © 2024**
 *
 * Status aktivitas dari RogaClient.
 *
 * ### Nilai yang Mungkin:
 * - **active:** Status aktif/berjalan
 * - **inactive:** Status tidak aktif/berhenti
 *
 * @typedef {`active`|`inactive`} RogaActiveStatus
 */

/**
 * ## **Default Users | RogaBot © 2024**
 *
 * Konfigurasi default pengguna untuk notifikasi Edunex.
 *
 * ### Properti:
 * - **telegramUserId:** ID pengguna Telegram untuk notifikasi
 * - **gmailUsername:** Username Gmail untuk notifikasi
 * - **discordUserId:** ID pengguna Discord untuk notifikasi
 * - **webhookURL:** URL webhook Discord untuk notifikasi
 *
 * @typedef {Object} DefaultUsers
 * @property {string} telegramUserId - ID pengguna Telegram
 * @property {string} gmailUsername - Username Gmail
 * @property {string} discordUserId - ID pengguna Discord
 * @property {string} webhookURL - URL webhook Discord
 */

/**
 * ## **Roga Configurations | RogaBot © 2024**
 *
 * Konfigurasi utama untuk RogaClient.
 *
 * ### Properti Konfigurasi:
 * - **Database:** URI MongoDB untuk koneksi
 * - **Gmail:** Username dan password aplikasi Gmail
 * - **Edunex:** Bearer token untuk autentikasi
 * - **Bot Tokens:** Token untuk Telegram dan Discord
 * - **Default Users:** Konfigurasi pengguna default
 *
 * @typedef {Object} RogaConfigurations
 * @property {string} mongoURI - URI koneksi MongoDB
 * @property {string} gmailUsername - Username Gmail
 * @property {string} gmailPassword - Password aplikasi Gmail
 * @property {string} edunexBearer - Token bearer Edunex
 * @property {string} telegramToken - Token bot Telegram
 * @property {string} discordToken - Token bot Discord
 * @property {string} discordWebhook - URL webhook Discord
 * @property {DefaultUsers} defaultUsers - Konfigurasi pengguna default
 */

/**
 * ## **Database Credentials | RogaBot © 2024**
 *
 * Kredensial untuk koneksi database MongoDB.
 *
 * ### Properti:
 * - **mongoURI:** URI koneksi ke MongoDB
 *
 * @typedef {Object} DatabaseCredentials
 * @property {string} mongoURI - URI koneksi MongoDB
 */

/**
 * ## **Gmail Credentials | RogaBot © 2024**
 *
 * Kredensial untuk autentikasi layanan Gmail.
 *
 * ### Properti:
 * - **username:** Nama pengguna Gmail
 * - **password:** Password aplikasi Gmail
 *
 * @typedef {Object} GmailCredentials
 * @property {string} username - Username Gmail
 * @property {string} password - Password aplikasi Gmail
 */

/**
 * ## **Telegram Bot Credentials | RogaBot © 2024**
 *
 * Kredensial untuk bot Telegram.
 *
 * ### Properti:
 * - **token:** Token bot Telegram untuk autentikasi
 *
 * @typedef {Object} TelegramBotCredentials
 * @property {string} token - Token bot Telegram
 */

/** * ## **Discord Bot Credentials | RogaBot © 2024**
 *
 * Kredensial untuk bot Discord.
 *
 * ### Properti:
 * - **token:** Token bot Discord untuk autentikasi
 *
 * @typedef {Object} DiscordBotCredentials
 * @property {string} token - Token bot Discord
 */

/**
 * ## **Discord Webhook Credentials | RogaBot © 2024**
 *
 * Kredensial untuk webhook Discord.
 *
 * ### Properti:
 * - **url:** URL webhook Discord untuk pengiriman pesan
 *
 * @typedef {Object} DiscordWebhookCredentials
 * @property {string} url - URL webhook Discord
 */

/**
 * ## **Start Returned Data | RogaBot © 2024**
 *
 * Data yang dikembalikan saat menjalankan RogaClient.start().
 *
 * ### Properti Client:
 * - **Gmail:** Client untuk layanan email
 * - **Discord:** Client untuk bot Discord
 * - **Telegram:** Client untuk bot Telegram
 * - **Webhook:** Client untuk webhook Discord
 *
 * @typedef {Object} StartReturnedData
 * @property {Mailer} gmailClient - Client Gmail
 * @property {Discord.Client} discordClient - Client Discord bot
 * @property {Telegram} telegramClient - Client Telegram bot
 * @property {Discord.WebhookClient} webhookClient - Client webhook Discord
 */

/**
 * ## **Edunex Request Options | RogaBot © 2024**
 *
 * Opsi permintaan untuk API Edunex.
 *
 * ### Properti:
 * - **path:** Path API Edunex
 * - **client:** Instance RogaClient
 *
 * @typedef {Object} EdunexRequestOptions
 * @property {string} path - Path API Edunex
 * @property {RogaClient} client - Instance RogaClient
 */

/**
 * ## **Edunex Handler Options | RogaBot © 2024**
 *
 * Opsi handler untuk layanan Edunex.
 *
 * ### Properti:
 * - **bearer:** Bearer token untuk autentikasi Edunex
 * - **client:** Instance RogaClient
 *
 * @typedef {Object} EdunexHandlerOptions
 * @property {string} bearer - Bearer token Edunex
 * @property {RogaClient} client - Instance RogaClient
 */

/**
 * ## **Edunex Modules Handler Options | RogaBot © 2024**
 *
 * Opsi handler untuk modul Edunex.
 *
 * ### Properti:
 * - **bearer:** Bearer token untuk autentikasi Edunex
 * - **todo:** Objek data Edunex Todo
 * - **client:** Instance RogaClient
 *
 * @typedef {Object} EdunexModulesHandlerOptions
 * @property {string} bearer - Bearer token Edunex
 * @property {EdunexTodoObject} todo - Objek data Edunex Todo
 * @property {RogaClient} client - Instance RogaClient
 */

/**
 * ## **Edunex Todo Object | RogaBot © 2024**
 *
 * Objek data Todo yang berisi berbagai kategori tugas Edunex.
 *
 * ### Properti:
 * - **tasks:** Daftar TASKS yang ada pada Edunex
 * - **exams:** Daftar EXAMS yang ada pada Edunex
 * - **questions:** Daftar QUESTIONS yang ada pada Edunex
 * - **modules:** Daftar MODULES yang ada pada Edunex
 *
 * @typedef {Object} EdunexTodoObject
 * @property {Array.<EdunexTodoSelfData>} tasks - Daftar TASKS
 * @property {Array.<EdunexTodoSelfData>} exams - Daftar EXAMS
 * @property {Array.<EdunexTodoSelfData>} questions - Daftar QUESTIONS
 * @property {Array.<EdunexTodoSelfData>} modules - Daftar MODULES
 */

/**
 * ## **Edunex Todo Self Data | RogaBot © 2024**
 *
 * Data self untuk setiap kategori Todo Edunex.
 *
 * ### Properti:
 * - **type:** Tipe Self Data
 * - **code:** Kode Mata Kuliah
 * - **course:** Nama Kelas / Course
 * - **name:** Judul Modul Self Data
 * - **time:** Deadline Modul Self Data
 * - **id:** Self ID untuk pencarian lebih lanjut
 *
 * @typedef {Object} EdunexTodoSelfData
 * @property {string} type - Tipe Self Data
 * @property {string} code - Kode Mata Kuliah * @property {string} course - Nama Kelas / Course
 * @property {string} name - Judul Modul Self Data
 * @property {string} time - Deadline Modul Self Data
 * @property {number} id - Self ID
 */

/**
 * ## **Edunex Task Data | RogaBot © 2024**
 *
 * Data utama dari Assignment tugas Edunex.
 *
 * ### Properti:
 * - **data:** Data utama dari Assignment
 *
 * @typedef {Object} EdunexTaskData
 * @property {EdunexTaskSelfData} data - Data utama dari Assignment
 */

/**
 * ## **Edunex Task Self Data | RogaBot © 2024**
 *
 * Data self dari tugas Edunex.
 *
 * ### Properti:
 * - **type:** Jenis data, misalnya "tasks"
 * - **id:** ID tugas
 * - **attributes:** Properti dan atribut detail dari tugas
 * - **links:** URL referensi untuk tugas
 *
 * @typedef {Object} EdunexTaskSelfData
 * @property {string} type - Jenis data
 * @property {number} id - ID tugas
 * @property {EdunexTaskAttributes} attributes - Properti dan atribut detail
 * @property {EdunexTaskLinks} links - URL referensi
 */

/**
 * ## **Edunex Task Attributes | RogaBot © 2024**
 *
 * Atribut dan properti detail dari tugas Edunex.
 *
 * ### Properti:
 * - **taskable_type:** Jenis entitas terkait tugas, misalnya "modules"
 * - **taskable_id:** ID entitas terkait tugas
 * - **name:** Nama tugas
 * - **description:** Deskripsi tugas dalam format HTML
 * - **files:** Daftar file yang terhubung dengan tugas
 * - **type:** Jenis tugas, misalnya "PERSONAL"
 * - **is_active:** Status apakah tugas aktif (1 = aktif)
 * - **start_at:** Waktu mulai tugas dalam format ISO 8601
 * - **end_at:** Waktu selesai tugas dalam format ISO 8601
 * - **lptk_id:** ID LPTK
 * - **created_by:** Nama pembuat tugas
 * - **updated_by:** Nama yang terakhir mengupdate tugas
 * - **deleted_by:** Nama yang menghapus tugas
 * - **created_at:** Tanggal pembuatan tugas dalam format ISO 8601
 * - **updated_at:** Tanggal update tugas dalam format ISO 8601
 * - **status:** Status penugasan, misalnya "assigned"
 * - **course_id:** ID kursus terkait tugas
 * - **download_url:** URL unduhan tugas
 * - **course_name:** Nama kursus terkait
 * - **course_code:** Kode kursus terkait
 * - **period_id:** ID periode kursus
 * - **lecturer_percentage:** Persentase penilaian oleh dosen
 * - **student_percentage:** Persentase penilaian oleh siswa
 * - **all_class:** Apakah tugas berlaku untuk semua kelas
 * - **is_assesment_open:** Status apakah penilaian terbuka
 * - **assesment_method:** Metode penilaian, misalnya "rubric"
 * - **rubrics:** Daftar rubrik penilaian
 * - **open_status:** Status keterbukaan tugas, misalnya "overdue"
 * - **answers:** Daftar jawaban tugas
 * - **file_required:** Apakah file diperlukan untuk tugas
 * - **is_lateable:** Apakah tugas bisa terlambat dikumpulkan
 * - **domain:** Domain tugas, misalnya "task"
 * - **show_score:** Apakah skor ditampilkan (0 = tidak ditampilkan)
 *
 * @typedef {Object} EdunexTaskAttributes
 * @property {string} taskable_type - Jenis entitas terkait tugas
 * @property {number} taskable_id - ID entitas terkait tugas
 * @property {string} name - Nama tugas
 * @property {string} description - Deskripsi tugas dalam format HTML
 * @property {Array.<EdunexTaskFile>} files - Daftar file yang terhubung
 * @property {string} type - Jenis tugas
 * @property {number} is_active - Status apakah tugas aktif
 * @property {string} start_at - Waktu mulai t ugas dalam format ISO 8601
 * @property {string} end_at - Waktu selesai tugas dalam format ISO 8601
 * @property {number} lptk_id - ID LPTK
 * @property {string} created_by - Nama pembuat tugas
 * @property {string} updated_by - Nama yang terakhir mengupdate tugas
 * @property {string} deleted_by - Nama yang menghapus tugas
 * @property {string} created_at - Tanggal pembuatan tugas dalam format ISO 8601
 * @property {string} updated_at - Tanggal update tugas dalam format ISO 8601
 * @property {string} status - Status penugasan
 * @property {number} course_id - ID kursus terkait tugas
 * @property {string} download_url - URL unduhan tugas
 * @property {string} course_name - Nama kursus terkait
 * @property {string} course_code - Kode kursus terkait
 * @property {number} period_id - ID periode kursus
 * @property {number} lecturer_percentage - Persentase penilaian oleh dosen
 * @property {number} student_percentage - Persentase penilaian oleh siswa
 * @property {number} all_class - Apakah tugas berlaku untuk semua kelas
 * @property {number} is_assesment_open - Status apakah penilaian terbuka
 * @property {string} assesment_method - Metode penilaian
 * @property {Array.<EdunexTaskRubric>} rubrics - Daftar rubrik penilaian
 * @property {string} open_status - Status keterbukaan tugas
 * @property {Array.<EdunexTaskAnswer>} answers - Daftar jawaban tugas
 * @property {number} file_required - Apakah file diperlukan untuk tugas
 * @property {number} is_lateable - Apakah tugas bisa terlambat dikumpulkan
 * @property {string} domain - Domain tugas
 * @property {number} show_score - Apakah skor ditampilkan
 */

/**
 * ## **Edunex Task File | RogaBot © 2024**
 *
 * File yang terhubung dengan tugas Edunex.
 *
 * ### Properti:
 * - **name:** Nama file
 * - **file:** URL file
 *
 * @typedef {Object} EdunexTaskFile
 * @property {string} name - Nama file
 * @property {string} file - URL file
 */

/**
 * ## **Edunex Task Rubric | RogaBot © 2024**
 *
 * Rubrik penilaian untuk tugas Edunex.
 *
 * ### Properti:
 * - **id:** ID rubrik
 * - **task_id:** ID tugas terkait rubrik
 * - **criteria:** Kriteria penilaian dalam rubrik
 * - **deleted_at:** Waktu penghapusan rubrik
 * - **created_at:** Waktu pembuatan rubrik dalam format ISO 8601
 * - **updated_at:** Waktu update rubrik dalam format ISO 8601
 * - **percentage:** Persentase rubrik
 * - **levels:** Daftar level penilaian dalam rubrik
 *
 * @typedef {Object} EdunexTaskRubric
 * @property {number} id - ID rubrik
 * @property {number} task_id - ID tugas terkait rubrik
 * @property {string} criteria - Kriteria penilaian dalam rubrik
 * @property {string} deleted_at - Waktu penghapusan rubrik
 * @property {string} created_at - Waktu pembuatan rubrik dalam format ISO 8601
 * @property {string} updated_at - Waktu update rubrik dalam format ISO 8601
 * @property {number} percentage - Persentase rubrik
 * @property {Array.<EdunexTaskRubricLevel>} levels - Daftar level penilaian
 */

/**
 * ## **Edunex Task Rubric Level | RogaBot © 2024**
 *
 * Level penilaian dalam rubrik tugas Edunex.
 *
 * ### Properti:
 * - **id:** ID level rubrik
 * - **task_id:** ID tugas terkait level
 * - **task_criteria_id:** ID kriteria terkait level
 * - **level:** Level penilaian, misalnya "level 1"
 * - **point:** Poin yang diberikan untuk level tersebut
 * - **point_min:** Poin minimum untuk level tersebut
 * - **point_max:** Poin maksimum untuk level tersebut
 * - **deleted_at:** Waktu penghapusan level
 * - **created_at:** Waktu pembuatan level dalam format ISO 8601
 * - **updated_at:** Waktu update level dalam format ISO 8601
 * - **description:** Deskripsi level
 *
 * @typedef {Object} EdunexTaskRubricLevel
 * @property {number} id - ID level rubrik
 * @property {number} task_id - ID tugas terkait level
 * @property {number} task_criteria_id - ID kriteria terkait level
 * @property {string} level - Level penilaian
 * @property {number} point - Poin yang diberikan
 * @property {number} point_min - Poin minimum
 * @property {number} point_max - Poin maksimum
 * @property {string} deleted_at - Waktu penghapusan level
 * @property {string} created_at - Waktu pembuatan level dalam format ISO 8601
 * @property {string} updated_at - Waktu update level dalam format ISO 8601
 * @property {string} description - Deskripsi level
 */

/**
 * ## **Edunex Task Answer | RogaBot © 2024**
 *
 * Jawaban tugas Edunex.
 *
 * ### Properti:
 * - **id:** ID jawaban tugas
 * - **task_id:** ID tugas terkait jawaban
 * - **student_id:** ID siswa yang memberikan jawaban
 * - **answer:** Jawaban siswa dalam format HTML
 * - **file:** Nama file jawaban
 * - **score:** Skor yang diberikan (default 0)
 * - **is_sent:** Status apakah jawaban telah dikirim (1 = terkirim)
 * - **sent_at:** Waktu pengiriman jawaban dalam format ISO 8601
 * - **deleted_at:** Waktu penghapusan jawaban
 * - **created_at:** Waktu pembuatan jawaban dalam format ISO 8601
 * - **updated_at:** Waktu update jawaban dalam format ISO 8601
 * - **verified_at:** Waktu verifikasi jawaban
 * - **comment:** Komentar pada jawaban
 * - **verified_by:** Nama yang memverifikasi jawaban
 * - **sent_by:** ID pengguna yang mengirim jawaban
 * - **files:** Daftar file yang terhubung dengan jawaban
 *
 * @typedef {Object} EdunexTaskAnswer
 * @property {number} id - ID jawaban tugas
 * @property {number} task_id - ID tugas terkait jawaban
 * @property {number} student_id - ID siswa yang memberikan jawaban
 * @property {string} answer - Jawaban siswa dalam format HTML
 * @property {string} file - Nama file jawaban
 * @property {number} score - Skor yang diberikan
 * @property {number} is_sent - Status apakah jawaban telah dikirim
 * @property {string} sent_at - Waktu pengiriman jawaban dalam format ISO 8601
 * @property {string} deleted_at - Waktu penghapusan jawaban
 * @property {string} created_at - Waktu pembuatan jawaban dalam format ISO 8601
 * @property {string} updated_at - Waktu update jawaban dalam format ISO 8601
 * @property {string} verified_at - Waktu verifikasi jawaban
 * @property {string} comment - Komentar pada jawaban
 * @property {string} verified_by - Nama yang memverifikasi jawaban
 * @property {number} sent_by - ID pengguna yang mengirim jawaban
 * @property {Array.<EdunexTaskAnswerFile>} files - Daftar file yang terhubung
 */

/**
 * ## **Edunex Task Answer File | RogaBot © 2024**
 *
 * File yang terhubung dengan jawaban tugas Edunex.
 *
 * ### Properti:
 * - **id:** ID file jawaban
 * - **fileable_type:** Jenis file terkait, misalnya "task_answers"
 * - **fileable_id:** ID entitas terkait file
 * - **name:** Nama file
 * - **file:** URL file
 * - **lptk_id:** ID LPTK
 * - **course_id:** ID kursus terkait
 * - **created_at:** Waktu pembuatan file dalam format ISO 8601
 * - **updated_at:** Waktu update file dalam format ISO 8601
 * - **deleted_at:** Waktu penghapusan file
 *
 * @typedef {Object} EdunexTaskAnswerFile
 * @property {number} id - ID file jaw aban
 * @property {string} fileable_type - Jenis file terkait
 * @property {string} fileable_id - ID entitas terkait file
 * @property {string} name - Nama file
 * @property {string} file - URL file
 * @property {number} lptk_id - ID LPTK
 * @property {number} course_id - ID kursus terkait
 * @property {string} created_at - Waktu pembuatan file dalam format ISO 8601
 * @property {string} updated_at - Waktu update file dalam format ISO 8601
 * @property {string} deleted_at - Waktu penghapusan file
 */

/**
 * ## **Edunex Task Links | RogaBot © 2024**
 *
 * Tautan terkait tugas Edunex.
 *
 * ### Properti:
 * - **self:** URL tugas terkait
 *
 * @typedef {Object} EdunexTaskLinks
 * @property {string} self - URL tugas terkait
 */

/**
 * ## **Edunex Exam Data | RogaBot © 2024**
 *
 * Data utama dari Exam Assignment Edunex.
 *
 * ### Properti:
 * - **data:** Data utama dari Assignment
 *
 * @typedef {Object} EdunexExamData
 * @property {EdunexExamSelfData} data - Data utama dari Assignment
 */

/**
 * ## **Edunex Exam Self Data | RogaBot © 2024**
 *
 * Objek data yang merepresentasikan detail Exam.
 *
 * ### Properti:
 * - **type:** Jenis dari Exam (contoh: quiz)
 * - **id:** ID unik dari Exam
 * - **attributes:** Atribut dari Exam
 * - **links:** Tautan API terkait dengan Exam
 *
 * @typedef {Object} EdunexExamSelfData
 * @property {string} type - Jenis dari Exam
 * @property {number} id - ID unik dari Exam
 * @property {EdunexExamAttributes} attributes - Atribut dari Exam
 * @property {EdunexExamLinks} links - Tautan API terkait dengan Exam
 */

/**
 * ## **Edunex Exam Attributes | RogaBot © 2024**
 *
 * Atribut yang merepresentasikan detail dari Exam.
 *
 * ### Properti:
 * - **activity_id:** ID aktivitas terkait Exam
 * - **type:** Jenis dari Exam (contoh: Kuis)
 * - **name:** Nama dari Exam
 * - **created_by:** ID pengguna yang membuat Exam
 * - **updated_by:** ID pengguna yang memperbarui Exam terakhir kali
 * - **deleted_by:** ID pengguna yang menghapus Exam, null jika tidak dihapus
 * - **deleted_at:** Waktu ketika Exam dihapus, null jika tidak dihapus
 * - **created_at:** Waktu ketika Exam dibuat
 * - **updated_at:** Waktu ketika Exam terakhir diperbarui
 * - **start_at:** Waktu mulai Exam
 * - **end_at:** Waktu selesai Exam
 * - **passing_grade:** Nilai lulus dari Exam
 * - **package:** ID paket terkait Exam
 * - **course_id:** ID kursus terkait Exam
 * - **is_published:** Status apakah Exam telah dipublikasikan
 * - **is_finished:** Status apakah Exam sudah selesai
 * - **is_show_solution:** Status apakah solusi akan ditampilkan setelah Exam
 * - **is_show_score:** Status apakah skor akan ditampilkan setelah Exam
 * - **retry:** Jumlah kesempatan untuk mengulang Exam
 * - **remaining_time:** Sisa waktu untuk menyelesaikan Exam (dalam detik)
 * - **is_back:** Status apakah peserta dapat kembali ke soal sebelumnya
 * - **period_id:** ID periode Exam
 * - **is_duration:** Status apakah Exam memiliki durasi terbatas
 * - **duration:** Durasi Exam dalam menit
 * - **start_status:** Status saat ini (misal: "end")
 * - **intro:** Teks pengantar sebelum memulai Exam
 * - **is_assistant:** Status apakah dapat melibatkan asisten
 * - **is_publishing:** Status proses publikasi
 * - **is_shuffle:** Status apakah soal akan diacak
 * - **final_score_type:** Tipe skor akhir (contoh: "LATEST")
 * - **is_restricted_ip:** Status pembatasan IP
 * - **ip_whitelists:** Daftar IP yang diizink an
 * - **is_safe:** Status keamanan Exam
 * - **is_token:** Status penggunaan token
 * - **is_mobile:** Status apakah bisa diakses melalui mobile
 * - **use_autograder:** Status penggunaan autograder
 * - **auto_apply_scoregrader:** Status penerapan skor otomatis oleh autograder
 * - **is_airplane:** Status apakah Exam dalam mode pesawat
 * - **is_network_change:** Status apakah terjadi perubahan jaringan
 * - **is_minimize:** Status apakah jendela Exam telah diminimalkan
 * - **is_incoming_call:** Status apakah ada panggilan masuk selama Exam
 * - **is_sms:** Status apakah ada SMS masuk selama Exam
 * - **is_show_solution_directly:** Status apakah solusi ditampilkan langsung setelah Exam
 *
 * @typedef {Object} EdunexExamAttributes
 * @property {number} activity_id - ID aktivitas terkait Exam
 * @property {string} type - Jenis dari Exam
 * @property {string} name - Nama dari Exam
 * @property {number} created_by - ID pengguna yang membuat Exam
 * @property {number} updated_by - ID pengguna yang memperbarui Exam terakhir kali
 * @property {number} deleted_by - ID pengguna yang menghapus Exam
 * @property {string} deleted_at - Waktu ketika Exam dihapus
 * @property {string} created_at - Waktu ketika Exam dibuat
 * @property {string} updated_at - Waktu ketika Exam terakhir diperbarui
 * @property {string} start_at - Waktu mulai Exam
 * @property {string} end_at - Waktu selesai Exam
 * @property {number} passing_grade - Nilai lulus dari Exam
 * @property {number} package - ID paket terkait Exam
 * @property {number} course_id - ID kursus terkait Exam
 * @property {number} is_published - Status apakah Exam telah dipublikasikan
 * @property {number} is_finished - Status apakah Exam sudah selesai
 * @property {number} is_show_solution - Status apakah solusi akan ditampilkan setelah Exam
 * @property {number} is_show_score - Status apakah skor akan ditampilkan setelah Exam
 * @property {number} retry - Jumlah kesempatan untuk mengulang Exam
 * @property {number} remaining_time - Sisa waktu untuk menyelesaikan Exam
 * @property {number} is_back - Status apakah peserta dapat kembali ke soal sebelumnya
 * @property {number} period_id - ID periode Exam
 * @property {number} is_duration - Status apakah Exam memiliki durasi terbatas
 * @property {number} duration - Durasi Exam dalam menit
 * @property {string} start_status - Status saat ini
 * @property {string} intro - Teks pengantar sebelum memulai Exam
 * @property {number} is_assistant - Status apakah dapat melibatkan asisten
 * @property {number} is_publishing - Status proses publikasi
 * @property {number} is_shuffle - Status apakah soal akan diacak
 * @property {string} final_score_type - Tipe skor akhir
 * @property {number} is_restricted_ip - Status pembatasan IP
 * @property {Array.<string>} ip_whitelists - Daftar IP yang diizinkan
 * @property {number} is_safe - Status keamanan Exam
 * @property {number} is_token - Status penggunaan token
 * @property {number} is_mobile - Status apakah bisa diakses melalui mobile
 * @property {number} use_autograder - Status penggunaan autograder
 * @property {number} auto_apply_scoregrader - Status penerapan skor otomatis oleh autograder
 * @property {number} is_airplane - Status apakah Exam dalam mode pesawat
 * @property {number} is_network_change - Status apakah terjadi perubahan jaringan
 * @property {number} is_minimize - Status apakah jendela Exam telah diminimalkan
 * @property {number} is_incoming_call - Status apakah ada panggilan masuk selama Exam
 * @property {number} is_sms - Status apakah ada SMS masuk selama Exam
 * @property {number} is_show_solution_directly - Status apakah solusi ditampilkan langsung setelah Exam
 */

/**
 * ## **Edunex Exam Links | RogaBot © 2024**
 *
 * Tautan API terkait dengan Exam.
 *
 * ### Properti:
 * - **self:** Tautan untuk mengakses Exam ini
 *
 * @typedef {Object} EdunexExamLinks
 * @property {string} self - Tautan untuk mengakses Exam
 */

/**
 * ## **Edunex User Data | RogaBot © 2024**
 *
 * Objek detail kursus.
 *
 * ### Properti:
 * - **user:** Detail pengguna yang terkait dengan kursus
 * - **course:** ID kursus
 * - **class:** ID kelas
 * - **major:** Kode jurusan
 * - **faculty:** Kode fakultas
 *
 * @typedef {Object} EdunexUserData
 * @property {EdunexUser SelfData} user - Detail pengguna
 * @property {number} course - ID kursus
 * @property {number} class - ID kelas
 * @property {string} major - Kode jurusan
 * @property {string} faculty - Kode fakultas
 */

/**
 * ## **Edunex User Self Data | RogaBot © 2024**
 *
 * Objek informasi pengguna.
 *
 * ### Properti:
 * - **id:** ID unik untuk pengguna
 * - **username:** Nama pengguna atau kode identifikasi
 * - **name:** Nama lengkap pengguna
 * - **email:** Email atau kode identifikasi pengguna
 * - **level:** Tingkat pengguna, seperti "LECTURER"
 *
 * @typedef {Object} EdunexUser SelfData
 * @property {number} id - ID unik untuk pengguna
 * @property {string} username - Nama pengguna atau kode identifikasi
 * @property {string} name - Nama lengkap pengguna
 * @property {string} email - Email atau kode identifikasi pengguna
 * @property {string} level - Tingkat pengguna
 */

/**
 * ## **Replacer Options | RogaBot © 2024**
 *
 * Fungsi yang digunakan untuk mereplace variabel dengan data real.
 *
 * ### Properti:
 * - **type:** Tipe data yang akan dikirim
 * - **platform:** Platform yang akan digunakan untuk mengirim data
 * - **message:** Data yang ada pada message
 *
 * @typedef {Object} ReplacerOptions
 * @property {string} type - Tipe data yang akan dikirim
 * @property {string} platform - Platform yang akan digunakan
 * @property {ReplacerMessage} message - Data yang ada pada message
 */

/**
 * ## **Replacer Message | RogaBot © 2024**
 *
 * Data yang ada pada message.
 *
 * ### Properti:
 * - **nama_dosen:** Nama dosen
 * - **mata_kuliah:** Mata kuliah
 * - **nama:** Nama tugas/Exam/Quiz
 * - **tanggal_mulai:** Tanggal dimulainya Exam/Quiz
 * - **deadline:** Deadline pengerjaan Exam/Quiz
 * - **durasi:** Durasi pengerjaan Exam/Quiz
 * - **kesempatan:** Banyaknya kesempatan mengerjakan Exam/Quiz
 * - **can_back:** Apakah Exam/Quiz bisa kembali ke soal sebelumnya
 * - **tanggal_upload:** Tanggal Exam/Quiz diunggah oleh dosen
 * - **url_edunex:** URL menuju Edunex
 *
 * @typedef {Object} ReplacerMessage
 * @property {string} nama_dosen - Nama dosen
 * @property {string} mata_kuliah - Mata kuliah
 * @property {string} nama - Nama tugas/Exam/Quiz
 * @property {string} tanggal_mulai - Tanggal dimulainya Exam/Quiz
 * @property {string} deadline - Deadline pengerjaan Exam/Quiz
 * @property {string} durasi - Durasi pengerjaan Exam/Quiz
 * @property {string} kesempatan - Banyaknya kesempatan mengerjakan Exam/Quiz
 * @property {string} can_back - Apakah Exam/Quiz bisa kembali ke soal sebelumnya
 * @property {string} tanggal_upload - Tanggal Exam/Quiz diunggah oleh dosen
 * @property {string} url_edunex - URL menuju Edunex
 */

/**
 * ## **Send Data Exam | RogaBot © 2024**
 *
 * Data yang dikirimkan ke RogaClient.
 *
 * ### Properti:
 * - **client:** Instance RogaClient yang digunakan untuk mengirim pesan
 * - **message:** Detail pesan yang dikirim
 *
 * @typedef {Object} SendDataExam
 * @property {RogaClient} client - Instance RogaClient
 * @property {ExamMessageDetails} message - Detail pesan yang dikirim
 */

/**
 * ## **Exam Message Details | RogaBot © 2024**
 *
 * Detail pesan yang dikirim.
 *
 * ### Properti:
 * - **nama_dosen:** Nama dosen yang diambil dari `assignmentData.data.attributes.created_by`
 * - **mata_kuliah:** Mata kuliah dengan format `Nama Mata Kuliah (Kode Mata Kuliah)`
 * - **nama:** Nama tugas/assignment dari `assignmentData.data.attributes.name`
 * - **tanggal_mulai:** Tanggal dimulainya tugas dalam format LLLL
 * - **deadline:** Tanggal deadline tugas dalam format LLLL
 * - **tanggal_upload:** Tanggal upload tugas oleh dosen dalam format LLLL
 * - **url_edunex:** URL menuju Edunex untuk mengambil tugas
 * - **durasi:** Durasi pengerjaan Exam/Quiz
 * - **kesempatan:** Banyaknya kesempatan mengerjakan Exam/Quiz
 * - **can_back:** Apakah Exam/Quiz bisa kembali ke soal sebelumnya
 *
 * @typedef {Object} ExamMessageDetails
 * @property {string} nama_dosen - Nama dosen
 * @property {string} mata_kuliah - Mata kuliah
 * @property {string} nama - Nama tugas/assignment
 * @property {string} tanggal_mulai - Tanggal dimulainya tugas
 * @property {string} deadline - Tanggal deadline tugas
 * @property {string} tanggal_upload - Tanggal upload tugas oleh dosen
 * @property {string} url_edunex - URL menuju Edunex
 * @property {string} durasi - Durasi pengerjaan Exam/Quiz
 * @property {string} kesempatan - Banyaknya kesempatan mengerjakan Exam/Quiz
 * @property {string} can_back - Apakah Exam/Quiz bisa kembali ke soal sebelumnya
 */

/**
 * ## **Send Data Assignment | RogaBot © 2024**
 *
 * Data yang dikirimkan ke RogaClient.
 *
 * ### Properti:
 * - **client:** Instance RogaClient yang digunakan untuk mengirim pesan
 * - **message:** Detail pesan yang dikirim
 *
 * @typedef {Object} SendDataAssignment
 * @property {RogaClient} client - Instance RogaClient
 * @property {AssignmentMessageDetails} message - Detail pesan yang dikirim
 */

/**
 * ## **Assignment Message Details | RogaBot © 2024**
 *
 * Detail pesan yang dikirim.
 *
 * ### Properti:
 * - **nama_dosen:** Nama dosen yang diambil dari `assignmentData.data.attributes.created_by`
 * - **mata_kuliah:** Mata kuliah dengan format `Nama Mata Kuliah (Kode Mata Kuliah)`
 * - **nama:** Nama tugas/assignment dari `assignmentData.data.attributes.name`
 * - **tanggal_mulai:** Tanggal dimulainya tugas dalam format LLLL
 * - **deadline:** Tanggal deadline tugas dalam format LLLL
 * - **tanggal_upload:** Tanggal upload tugas oleh dosen dalam format LLLL
 * - **url_edunex:** URL menuju Edunex untuk mengambil tugas
 *
 * @typedef {Object} AssignmentMessageDetails
 * @property {string} nama_dosen - Nama dosen
 * @property {string} mata_kuliah - Mata kuliah
 * @property {string} nama - Nama tugas/assignment
 * @property {string} tanggal_mulai - Tanggal dimulainya tugas
 * @property {string} deadline - Tanggal deadline tugas
 * @property {string} tanggal_upload - Tanggal upload tugas oleh dosen
 * @property {string} url_edunex - URL menuju Edunex
 */

module.exports = {};
