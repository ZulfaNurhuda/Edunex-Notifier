const TelegramBot = require('node-telegram-bot-api');
const fs = require(`fs`)

function replacer (nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes) {
  const data = fs.readFileSync(`${process.cwd()}/Template/messageTemplate.txt`, `utf8`);
  const dataReplaced = data.replace(`$nama_dosen`, nama_dosen)
                      .replace(`$mata_kuliah`, mata_kuliah)
                      .replace(`$nama_tugas`, nama_tugas)
                      .replace(`$deadline`, deadline)
                      .replace(`$tanggal_upload`, tanggal_upload)
                      .replace(`$quotes`, quotes)
  return dataReplaced;
}


/**
 * @param {TelegramBot} client Client Bot Telegram
 */
module.exports = async (client, { nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex }) => {
  const messageFinal = replacer(nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes);

    await client.sendMessage(1332834117, messageFinal, {
        parse_mode: `HTML`,
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Buka Edunex`,
                        url: url_edunex,
                    },
                ],
            ],
        },
    })
    .then((i) => {
        console.log(`V | Telegram Terkirim (${i.message_id})`)
    })
    .catch(e => console.error(`X | Error: ${e}`));
};