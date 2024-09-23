const mongoose = require(`mongoose`);

const dataTugas = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    main: String,
});

module.exports = mongoose.model(`DataTugas`, dataTugas, `dataTugas`);