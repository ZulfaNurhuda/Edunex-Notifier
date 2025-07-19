/**
 * @fileoverview This file contains the logic for making requests to the Edunex API.
 * @version 2.0.0
 * @author Zulfa Nurhuda
 * @copyright 2024 Zulfa Nurhuda
 */

const fetch = require('node-fetch');

/**
 * Makes a request to the Edunex API.
 * @param {object} options The options for the request.
 * @param {string} options.path The path to the API endpoint.
 * @param {string} options.bearer The bearer token for the API.
 * @returns {Promise<object>} The JSON response from the API.
 * @throws {Error} If an error occurs while making the request.
 */
const edunexRequest = async ({ path, bearer }) => {
    const response = await fetch(`https://edunex.itb.ac.id/api${path}`, {
        headers: {
            Authorization: `Bearer ${bearer}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch from Edunex API: ${response.statusText}`);
    }

    return response.json();
};

module.exports = edunexRequest;
