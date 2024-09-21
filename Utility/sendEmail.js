const nodemailer = require(`nodemailer`);
const fs = require(`fs`);

function replacer (nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex) {
  const data = fs.readFileSync(`${process.cwd()}/Template/notification.html`, `utf8`);
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

module.exports = async ({ nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex }) => {
  const htmlfile = replacer(nama_dosen, mata_kuliah, nama_tugas, deadline, tanggal_upload, quotes, url_edunex);
  
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
    subject: `Tugas Baru Edunex!`,
    html: htmlfile,
  };

  transporter.sendMail(mailOptions, function(e, i) {
    if (e) {
      console.error(`X | Error: ${e}`);
    } else {
      console.log(`V | Email Terkirim (${i.messageId})`);
    };
  });
};