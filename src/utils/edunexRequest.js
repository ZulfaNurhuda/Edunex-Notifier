/// Import Packages
const fetch = require(`node-fetch`);
const nodeUrl = require(`url`);

/// Import Structures
const RogaError = require(`../structures/RogaError`);

/// Import Types
const RogaTypes = require(`../types/types`);

/**
 * ## **Edunex Request Function | RogaBot © 2024 - ZulfaNurhuda.**
 * ```js
 * Fungsi yang digunakan untuk melakukan request data dengan Edunex Learning Management System milik Institut Teknologi Bandung.
 * ```
 * @param {RogaTypes.EdunexRequestOptions} options - Opsi untuk Edunex Handler.
 * @returns {Promise<Object>} `Promise<Object>` — Data hasil request Edunex.
 * @throws {TypeError} Jika parameter yang diberikan tidak valid.
 * @throws {Error} Jika terjadi kesalahan selama proses request atau respons tidak berhasil.
 * @autor `ZulfaNurhuda.` — My Developer
 */
async function edunexRequest(options) {
    if (!options || typeof options !== `object`) {
        throw new RogaError(`Parameter options harus berupa objek yang valid.`);
    }

    const { path, bearer } = options;

    if (!path || typeof path !== `string` || !path.trim()) {
        throw new RogaError(`Path harus berupa string.`);
    }

    if (!bearer || typeof bearer !== `string` || !bearer.trim()) {
        throw new RogaError(
            `Bearer harus berupa string token yang valid.`
        );
    }

    const baseEdunexBase64 = `aHR0cHM6Ly9hcGktZWR1bmV4LmNvZ25pc2lhLmlk`;
    let baseEdunex = ``;
    try {
        baseEdunex = Buffer.from(baseEdunexBase64, `base64`).toString(`utf8`);
    } catch (error) {
        throw new RogaError(`Gagal mendecode base url Edunex.`);
    }

    const url = new nodeUrl.URL(path, baseEdunex);

    const fetchOptions = {
        method: `GET`,
        headers: {
            Authorization: `Bearer ${bearer}`,
            "Content-Type": `application/json`,
            Accept: `application/json`,
        },
    };

    console.log(` ✔️ |  Request ke ${url.toString()} akan segera diproses. `);

    try {
        const response = await fetch(url.toString(), fetchOptions);

        if (!response.ok) {
            let responseData;
            try {
                responseData = await response.json();
            } catch (_) {
                responseData = await response.text();
            }

            /**
             * **Keterangan Error Yang Terjadi.**
             * @type {string}: Tipe data primitive String.
             */
            const errorText = responseData.error
                ? responseData.error.message
                : responseData.errors
                ? responseData.errors.title
                : responseData.message;

            throw new RogaError(
                `Response status ${response.status} - ${errorText}`
            );
        }

        console.log(` ✔️ |  Request ke ${url.toString()} berhasil. `);

        const data = await response.json();
        return data;
    } catch (error) {
        throw new RogaError(error.message || error);
    }
}

module.exports = edunexRequest;
