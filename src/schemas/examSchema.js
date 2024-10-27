/// Import Packages
const mongoose = require(`mongoose`);

/// Inisiasi Schema Exam
const exam = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: Number,
    examData: String,
});

/// Export Model
module.exports = mongoose.model(`Exam`, exam, `exam`);
