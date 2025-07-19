/**
 * @fileoverview This file contains the Mongoose schema for exams.
 * @version 3.0.0
 * @author Zulfa Nurhuda
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
