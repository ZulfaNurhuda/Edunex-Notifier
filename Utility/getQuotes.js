const fetch = require(`node-fetch`);

module.exports = async () => {
    return fetch(`https://raw.githubusercontent.com/well300/quotes-api/refs/heads/main/quotes.json`)
    .then(async (res) => {
      quotes = await res.json();
      return quotes[Math.floor(Math.random() * quotes.length)];
    })
    .catch(e => console.error(`X | Error: ${e}`));
};