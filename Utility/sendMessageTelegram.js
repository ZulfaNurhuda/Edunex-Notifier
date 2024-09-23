const TelegramBot = require('node-telegram-bot-api');
const fs = require(`fs`)

function replacerAssignment (nama_dosen, mata_kuliah, nama_tugas, deadline, quotes) {
  const data = fs.readFileSync(`${process.cwd()}/Template/messageTemplateAssignment.txt`, `utf8`);
  const dataReplaced = data.replace(`$nama_dosen`, nama_dosen)
                      .replace(`$mata_kuliah`, mata_kuliah)
                      .replace(`$nama_tugas`, nama_tugas)
                      .replace(`$deadline`, deadline)
                      .replace(`$quotes`, quotes)
  return dataReplaced;
}

function replacerExam (nama_dosen, mata_kuliah, nama_exam, tanggal_mulai, deadline, durasi, kesempatan, can_back, quotes) {
    let data = fs.readFileSync(`${process.cwd()}/Template/messageTemplateExam.txt`, `utf8`);
    const dataReplaced = data.replace(`$nama_dosen`, nama_dosen)
                        .replace(`$mata_kuliah`, mata_kuliah)
                        .replace(`$nama_exam`, nama_exam)
                        .replace(`$tanggal_mulai`, tanggal_mulai)
                        .replace(`$deadline`, deadline)
                        .replace(`$tanggal_mulai`, tanggal_mulai)
                        .replace(`$deadline`, deadline)
                        .replace(`$durasi`, durasi)
                        .replace(`$kesempatan`, kesempatan)
                        .replace(`$can_back`, can_back)
                        .replace(`$quotes`, quotes)
    return dataReplaced;
}


/**
 * @param {TelegramBot} client Client Bot Telegram
 */
module.exports = async (client, type, { nama_dosen, mata_kuliah, nama_tugas,  nama_exam, tanggal_mulai, deadline, durasi, kesempatan, can_back, quotes, url_edunex }) => {
    let messageFinal = ``;
    if (type === `assignment`) messageFinal = replacerAssignment(nama_dosen, mata_kuliah, nama_tugas, deadline, quotes, url_edunex);
    if (type === `exam`) messageFinal = replacerExam(nama_dosen, mata_kuliah, nama_exam, tanggal_mulai, deadline, durasi, kesempatan, can_back, quotes, url_edunex);
  
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