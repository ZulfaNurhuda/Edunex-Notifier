/**
 * @fileoverview This file contains the database connection logic.
 * @version 3.0.0
 * @author Zulfa Nurhuda
 */

const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * @param {string} mongoURI The MongoDB connection string.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while connecting to the database.
 */
const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
