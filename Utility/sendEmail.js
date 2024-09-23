const nodemailer = require(`nodemailer`);
const fs = require(`fs`);

function replacerAssignment (nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex) {
  let data = fs.readFileSync(`${process.cwd()}/Template/notificationAssignment.html`, `utf8`);
  const dataReplaced = data.replace(`$nama_dosen`, nama_dosen)
                      .replace(`$nama_dosen`, nama_dosen)
                      .replace(`$mata_kuliah`, mata_kuliah)
                      .replace(`$nama_tugas`, nama_tugas)
                      .replace(`$deadline`, deadline)
                      .replace(`$tanggal_upload`, tanggal_upload)
                      .replace(`$quotes`, quotes)
                      .replace(`$url_edunex`, url_edunex);
  return dataReplaced;
}

function replacerExam (nama_dosen, mata_kuliah, nama_exam, tanggal_mulai, deadline, durasi, kesempatan, can_back, tanggal_upload, quotes, url_edunex) {
    let data = fs.readFileSync(`${process.cwd()}/Template/notificationExam.html`, `utf8`);
    const dataReplaced = data.replace(`$nama_dosen`, nama_dosen)
                        .replace(`$nama_dosen`, nama_dosen)
                        .replace(`$mata_kuliah`, mata_kuliah)
                        .replace(`$nama_exam`, nama_exam)
                        .replace(`$tanggal_mulai`, tanggal_mulai)
                        .replace(`$deadline`, deadline)
                        .replace(`$tanggal_mulai`, tanggal_mulai)
                        .replace(`$deadline`, deadline)
                        .replace(`$durasi`, durasi)
                        .replace(`$kesempatan`, kesempatan)
                        .replace(`$can_back`, can_back)
                        .replace(`$tanggal_upload`, tanggal_upload)
                        .replace(`$quotes`, quotes)
                        .replace(`$url_edunex`, url_edunex);
    return dataReplaced;
}

/**
 * 
 * @param {String} type 
 * @param {} param1 
 */
module.exports = async (type, { nama_dosen, mata_kuliah, nama_tugas,  nama_exam, tanggal_mulai, deadline, tanggal_upload, durasi, kesempatan, can_back, quotes, url_edunex }) => {
  let htmlfile = ``;
  if (type === `assignment`) htmlfile = replacerAssignment(nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex);
  if (type === `exam`) htmlfile = replacerExam(nama_dosen, mata_kuliah, nama_exam, tanggal_mulai, deadline, durasi, kesempatan, can_back, tanggal_upload, quotes, url_edunex);
  
  const transporter = nodemailer.createTransport({
    host: `smtp.gmail.com`,
    port: 587,
    secure: false,
    auth: {
      user: `zulfa.radioactive@gmail.com`,
      pass: process.env.GMAIL_APP_PASS,
    },
  });
  
  var mailOptions = {
    from: `zulfa.radioactive@gmail.com`,
    to: `afluzkeren@gmail.com`,
    subject: `${type === `assignment` ? `Tugas` : `Kuis/Ujian`} Baru Edunex!`,
    html: htmlfile,
  };

  transporter.sendMail(mailOptions, (e, i) => {
    if (e) {
      console.error(`X | Error: ${e}`);
    } else {
      console.log(`V | Email Terkirim (${i.messageId})`);
    };
  });
};