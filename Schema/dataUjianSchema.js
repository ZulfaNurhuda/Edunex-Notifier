const mongoose = require(`mongoose`);

const dataUjian = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    main: String,
});

module.exports = mongoose.model(`DataUjian`, dataUjian, `dataUjian`);