require('dotenv').config({ path: `${process.cwd()}/.env`});
const handler = require(`./Utility/handler`);
const database = require(`./Utility/database`);

database().then(() => {
    handler().then(() => {
        console.log(`V | System is Ready!`)
        setInterval(() => {
            handler().catch(e => console.error(`X | Error: ${e}`));
        }, 1000 * 60 * 5)
    })
    .catch(e => console.error(`X | Error: ${e}`));
})
.catch(e => console.error(`X | Error: ${e}`));

process.on(`warning`, (e) => console.error(`X | Error: ${e}`));