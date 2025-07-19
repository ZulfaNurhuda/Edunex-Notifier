/**
 * @fileoverview This file contains the type definitions for the RogaBot.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

/**
 * @typedef {object} RogaConfigurations
 * @property {string} edunexBearer
 * @property {string} gmailAppUsername
 * @property {string} gmailAppPassword
 * @property {string} gmailDest
 * @property {string} telegramBotToken
 * @property {string} telegramDest
 * @property {string} discordBotToken
 * @property {string} discordChannelId
 * @property {string} discordWebhookUrl
 * @property {number} edunexHandlerInterval
 */

/**
 * @typedef {object} DatabaseCredentials
 * @property {string} mongoURI
 */

/**
 * @typedef {object} GmailCredentials
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {object} TelegramBotCredentials
 * @property {string} token
 */

/**
 * @typedef {object} DiscordBotCredentials
 * @property {string} token
 */

/**
 * @typedef {object} DiscordWebhookCredentials
 * @property {string} url
 */

/**
 * @typedef {object} EdunexHandlerOptions
 * @property {string} bearer
 * @property {RogaClient} client
 */

/**
 * @typedef {object} EdunexModulesHandlerOptions
 * @property {string} bearer
 * @property {object} todo
 * @property {RogaClient} client
 */

/**
 * @typedef {'active' | 'inactive'} RogaActiveStatus
 */

/**
 * @typedef {object} StartReturnedData
 * @property {Mailer} [gmailClient]
 * @property {Telegram} [telegramClient]
 * @property {Discord.Client} [discordClient]
 * @property {Discord.WebhookClient} [webhookClient]
 */

/**
 * @typedef {object} TemplateFile
 * @property {object} assignment
 * @property {string} assignment.email
 * @property {string} assignment.telegram
 * @property {string} assignment.webhook
 * @property {object} exam
 * @property {string} exam.email
 * @property {string} exam.telegram
 * @property {string} exam.webhook
 */

/**
 * @typedef {object} ReplacerOptions
 * @property {string} type
 * @property {string} platform
 * @property {object} message
 */

/**
 * @typedef {object} SendDataAssignment
 * @property {RogaClient} client
 * @property {AssignmentMessageDetails} message
 */

/**
 * @typedef {object} SendDataExam
 * @property {RogaClient} client
 * @property {ExamMessageDetails} message
 */

/**
 * @typedef {object} AssignmentMessageDetails
 * @property {string} nama_dosen
 * @property {string} mata_kuliah
 * @property {string} nama
 * @property {string} tanggal_mulai
 * @property {string} deadline
 * @property {string} tanggal_upload
 * @property {string} url_edunex
 */

/**
 * @typedef {object} ExamMessageDetails
 * @property {string} nama_dosen
 * @property {string} mata_kuliah
 * @property {string} nama
 * @property {string} tanggal_mulai
 * @property {string} deadline
 * @property {string} tanggal_upload
 * @property {string} durasi
 * @property {number} kesempatan
 * @property {string} can_back
 * @property {string} url_edunex
 */

/**
 * @typedef {object} EdunexTaskData
 * @property {object} data
 * @property {object} data.attributes
 * @property {string} data.attributes.created_by
 * @property {string} data.attributes.name
 * @property {string} data.attributes.start_at
 * @property {string} data.attributes.end_at
 * @property {string} data.attributes.created_at
 */

/**
 * @typedef {object} EdunexExamData
 * @property {object} data
 * @property {object} data.attributes
 * @property {string} data.attributes.created_by
 * @property {string} data.attributes.name
 * @property {string} data.attributes.start_at
 * @property {string} data.attributes.end_at
 * @property {string} data.attributes.created_at
 * @property {number} data.attributes.duration
 * @property {number} data.attributes.retry
 * @property {number} data.attributes.is_back
 */

/**
 * @typedef {object} EdunexUserData
 * @property {object} user
 * @property {string} user.name
 */

module.exports = {};
