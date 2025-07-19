/**
 * @fileoverview This file contains the Mongoose schema for assignments.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignmentId: {
        type: String,
        required: true,
        unique: true,
    },
    assignmentData: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
