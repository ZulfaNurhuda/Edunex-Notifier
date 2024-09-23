const fetch = require(`node-fetch`);

module.exports = async ({ path }) => {
  if (!path) path = ``;

  return fetch(`https://api-edunex.cognisia.id${path}`, {
    method: `GET`,
    headers: {
      Authorization: `Bearer ${process.env.EDUNEX_BEARER}`,
    }
  })
  .then (res => res.json())
  .catch(e => console.error(`X | Error: ${e}`));
};