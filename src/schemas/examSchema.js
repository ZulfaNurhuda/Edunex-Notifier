/**
 * @fileoverview This file contains the Mongoose schema for exams.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: {
        type: String,
        required: true,
        unique: true,
    },
    examData: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Exam', examSchema);
