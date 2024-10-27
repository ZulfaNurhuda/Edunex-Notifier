/// Import Packages
const mongoose = require(`mongoose`);

/// Inisiasi Schema Assignment
const assignment = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignmentId: Number,
    assignmentData: String,
});

/// Export Model
module.exports = mongoose.model(`Assignment`, assignment, `assignment`);
