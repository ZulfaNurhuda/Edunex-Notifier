const fetch = require(`node-fetch`);

module.exports = async ({ path }) => {
  return fetch(`https://api-edunex.cognisia.id${path}`, {
    method: `OPTIONS`,
    headers: {
      "Access-Control-Request-Headers": `authorization`,
      "Access-Control-Request-Method": `GET`,
      Origin: `https://edunex.itb.ac.id`,
      Referer: `https://edunex.itb.ac.id`,
      Host: `api-edunex.cognisia.id`
    }
  })
  .then (() => {
    return fetch(`https://api-edunex.cognisia.id${path}`, {
      method: `GET`,
      headers: {
        Authorization: `Bearer ${process.env.EDUNEX_BEARER}`,
      }
    })
    .then (res => res.json())
    .catch(e => console.error(`X | Error: ${e}`));
  })
  .catch(e => console.error(`X | Error: ${e}`));
};