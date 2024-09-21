const express = require(`express`);
const server = express();

server.all('/', (req, res) => res.send(`OK`));

module.exports = async () => {
  server.listen(3000, () => { 
    console.log(`V | Server Sudah Siap`) 
  });
}

