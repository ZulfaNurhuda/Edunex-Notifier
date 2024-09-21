const mongoose = require(`mongoose`);

const dataTugas = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    main: String,
});

module.exports = mongoose.model(`DataTugas`, dataTugas, `dataTugas`);