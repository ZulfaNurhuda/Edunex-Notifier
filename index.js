require('dotenv').config({ path: `${process.cwd()}/.env`});
const handler = require(`./Utility/handler`);

handler()
.then(() => {
    console.log(`System is Ready!`)
    setInterval(() => {
        handler().catch(e => console.error(`X | Error: ${e}`));
    }, 1000 * 60 * 5)
})
.catch(e => console.error(`X | Error: ${e}`));

process.on(`warning`, (e) => console.error(`X | Error: ${e}`));