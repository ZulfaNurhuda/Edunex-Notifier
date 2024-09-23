const TelegramBot = require('node-telegram-bot-api');
const moment = require(`moment-timezone`);
const mongoose = require(`mongoose`);
const edunexRequest = require(`./edunexRequest`);
const DataTugas = require(`../Schema/dataTugasSchema`);
const DataUjian = require(`../Schema/dataUjianSchema`);
const sendEmail = require(`./sendEmail`);
const sendMessageTelegram = require(`./sendMessageTelegram`);
const getQuotes = require(`./getQuotes`);

moment.locale(`id`);

/**
 * @param {TelegramBot} client Client Bot Telegram
 */
module.exports = async (client) => {
    edunexRequest({ path: `/todo` }).then((todo) => {
        if (todo.tasks.length > 0) {
            for (let i in todo.tasks) {
                DataTugas.findOne({
                    main: JSON.stringify(todo.tasks[i]),
                })
                .then(async(data) => {
                    if (data) return;

                    let quote = await getQuotes().then(quoteData => quoteData).catch(e => console.error(`X | Error: ${e}`));

                    edunexRequest({ path: `/course/modules/${todo.tasks[i].taskable_id}` })
                    .then((modules) => {
                        edunexRequest({ path:`/course/courses/${modules.data.attributes.course_id}?include=lecturer,lecturer.user` })
                        .then((course) => { 
                            sendEmail(`assignment`, {
                                nama_dosen: course.data.attributes.lecturer, 
                                mata_kuliah: `${todo.tasks[i].course} (${todo.tasks[i].code})`,
                                nama_tugas: modules.data.attributes.name,
                                deadline: moment(todo.tasks[i].time).tz('Asia/Jakarta').format('LLLL'), 
                                tanggal_upload: moment(Date.now()).tz('Asia/Jakarta').format('LLLL'),
                                quotes: `"${quote.quote}" (${quote.author})`,
                                url_edunex: `https://edunex.itb.ac.id/assignment/take/${todo.tasks[i].id}`,
                            })
                            .then(() => {
                                sendMessageTelegram(client, `assignment`, {
                                    nama_dosen: course.data.attributes.lecturer, 
                                    mata_kuliah: `${todo.tasks[i].course} (${todo.tasks[i].code})`,
                                    nama_tugas: modules.data.attributes.name,
                                    deadline: moment(todo.tasks[i].time).tz('Asia/Jakarta').format('LLLL'), 
                                    tanggal_upload: moment(Date.now()).tz('Asia/Jakarta').format('LLLL'),
                                    quotes: `"${quote.quote}" (${quote.author})`,
                                    url_edunex: `https://edunex.itb.ac.id/assignment/take/${todo.tasks[i].id}`,
                                }).then(() => {
                                    const dataTugas = new DataTugas({
                                        _id: new mongoose.Types.ObjectId(),
                                        main: JSON.stringify(todo.tasks[i]),
                                    });
                                    dataTugas.save().catch(e => console.error(`X | Error: ${e}`));
                                })
                                .catch(e => console.error(`X | Error: ${e}`));
                            })
                            .catch(e => console.error(`X | Error: ${e}`));
                        });
                    });
                });
            };
        } else if (todo.exams.length > 0) {
            for (let i in todo.exams) {
                DataUjian.findOne({
                    main: JSON.stringify(todo.exams[i]),
                })
                .then(async(data) => {
                    if (data) return;

                    let quote = await getQuotes().then(quoteData => quoteData).catch(e => console.error(`X | Error: ${e}`));

                    edunexRequest({ path: `/exam/exams/${todo.exams[i].id}` })
                    .then((exam) => {
                        edunexRequest({ path: `/course/activities/${exam.data.attributes.activity_id}` })
                        .then((act) => {
                            edunexRequest({ path:`/course/courses/${exam.data.attributes.course_id}?include=lecturer,lecturer.user` })
                            .then((course) => { 
                                sendEmail(`exam`, {
                                    nama_dosen: course.data.attributes.lecturer, 
                                    mata_kuliah: `${todo.exams[i].course} (${todo.exams[i].code})`,
                                    nama_exam: exam.data.attributes.name,
                                    tanggal_mulai: moment(exam.data.attributes.start_at).tz('Asia/Jakarta').format('LLLL'),
                                    deadline: moment(exam.data.attributes.end_at).tz('Asia/Jakarta').format('LLLL'), 
                                    tanggal_upload: moment(Date.now()).tz('Asia/Jakarta').format('LLLL'),
                                    durasi: `${exam.data.attributes.duration} Menit`,
                                    kesempatan: exam.data.attributes.retry,
                                    can_back: exam.data.attributes.is_back === 1 ? `Bisa` : `Tidak Bisa`,
                                    quotes: `"${quote.quote}" (${quote.author})`,
                                    url_edunex: `https://edunex.itb.ac.id/courses/${exam.data.attributes.course_id}/preview/${act.data.attributes.module_id}/${exam.data.attributes.activity_id}`,
                                })
                                .then(() => {
                                    sendMessageTelegram(client, `exam`, {
                                        nama_dosen: course.data.attributes.lecturer, 
                                        mata_kuliah: `${todo.exams[i].course} (${todo.exams[i].code})`,
                                        nama_exam: exam.data.attributes.name,
                                        tanggal_mulai: moment(exam.data.attributes.start_at).tz('Asia/Jakarta').format('LLLL'),
                                        deadline: moment(exam.data.attributes.end_at).tz('Asia/Jakarta').format('LLLL'),                                         durasi: `${exam.data.attributes.duration} Menit`,
                                        kesempatan: exam.data.attributes.retry,
                                        can_back: exam.data.attributes.is_back === 1 ? `Bisa` : `Tidak Bisa`,
                                        quotes: `"${quote.quote}" (${quote.author})`,
                                        url_edunex: `https://edunex.itb.ac.id/courses/${exam.data.attributes.course_id}/preview/${act.data.attributes.module_id}/${exam.data.attributes.activity_id}`,
                                    }).then(() => {
                                        const dataUjian = new DataUjian({
                                            _id: new mongoose.Types.ObjectId(),
                                            main: JSON.stringify(todo.exams[i]),
                                        });
                                        dataUjian.save().catch(e => console.error(`X | Error: ${e}`));
                                    })
                                    .catch(e => console.error(`X | Error: ${e}`));
                                })
                                .catch(e => console.error(`X | Error: ${e}`));
                            });
                        })
                        .catch(e => console.error(`X | Error: ${e}`));
                    });
                });
            };
        };
    });
};