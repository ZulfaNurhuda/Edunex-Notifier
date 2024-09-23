const moment = require(`moment-timezone`);
moment.locale(`id`)
console.log(moment(`2024-09-30T08:00:00+07:00`).tz(`Asia/Jakarta`).format(`LLLL`))