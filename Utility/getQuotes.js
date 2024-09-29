/// Load Package
const fetch = require(`node-fetch`);

/**
 * **Get Quotes Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Melakukan Request Data Dengan Layanan Penyedia Quotes
 * ```
 * @returns {Promise<Object>} `Promise<Object>` — Edunex Request Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
async function getQuotes() {
    const baseData = `aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3dlbGwzMDAvcXVvdGVzLWFwaS9yZWZzL2hlYWRzL21haW4vcXVvdGVzLmpzb24=`;
    return fetch(Buffer.from(baseData, `base64`).toString(`utf-8`))
        .then(async (res) => {
            quotes = await res.json();
            return quotes[Math.floor(Math.random() * quotes.length)];
        })
        .catch((e) => {
            throw new Error(e);
        });
}

module.exports = getQuotes;
