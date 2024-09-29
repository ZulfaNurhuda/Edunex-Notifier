/// Load Package
const fetch = require(`node-fetch`);

/**
 * **Edunex Request Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Function Yang Digunakan Untuk Melakukan Request Data Dengan Edunex Learning Management System Milik Institut Teknologi Bandung
 * ```
 * @param {Object} options Opsi Untuk Edunex Handler
 * @param {String} options.path Path API Edunex Request
 * @param {String} options.bearer Bearer Untuk Auth Edunex API
 * @returns {Promise<Object>} `Promise<Object>` — Edunex Request Executed
 * @author `ZulfaNurhuda.` — My Developer
 */
async function edunexRequest(options) {
    const baseData = `aHR0cHM6Ly9hcGktZWR1bmV4LmNvZ25pc2lhLmlk`;
    if (!options.path) options.path = ``;

    return fetch(
        `${Buffer.from(baseData, `base64`).toString(`utf-8`) + options.path}`,
        {
            method: `GET`,
            headers: {
                Authorization: `Bearer ${options.bearer}`,
            },
        }
    )
        .then((res) => res.json())
        .catch((e) => {
            throw new Error(e);
        });
}

module.exports = edunexRequest;
