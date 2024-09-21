const mongoose = require(`mongoose`);

module.exports = async () => {
    const dbOptions = {
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
    };

    mongoose.connect(process.env.MONGO_URI, dbOptions);
    mongoose.Promise = global.Promise;

    mongoose.connection.on(`connecting`, () => {
        console.log(`- | Mencoba Menyambung Ke Database`);
    });
    mongoose.connection.on(`connected`, () => {
        console.log(`V | Tersambung Ke Database`);
    });
    mongoose.connection.on(`reconnecting`, () => {
        console.log(`- | Mencoba Menyambungkan Ulang Ke Database`);
    });
    mongoose.connection.on(`disconected`, () => {
        console.error(`X | Sambungan Database Terputus`);
    });
    mongoose.connection.on(`err`, (e) => {
        console.error(`X | Error: ${e}`);
    });
};