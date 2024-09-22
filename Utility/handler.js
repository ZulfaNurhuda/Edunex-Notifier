const TelegramBot = require('node-telegram-bot-api');
const moment = require(`moment-timezone`);
const mongoose = require(`mongoose`);
const edunexRequest = require(`./edunexRequest`);
const DataTugas = require(`../Schema/dataTugasSchema`);
const sendEmail = require(`./sendEmail`);
const sendMessageTelegram = require(`./sendMessageTelegram`);
const getQuotes = require(`./getQuotes`);

moment.locale(`id`);

/**
 * @param {TelegramBot} client Client Bot WhatsApp
 */
module.exports = async (client) => {
    edunexRequest({ path: `/todo` }).then((todo) => {
        if (todo.tasks.length > 0) {
            for (let i in todo.tasks) {
                DataTugas.findOne({
                    main: JSON.stringify(todo.tasks[i]),
                })
                .then((data) => {
                    if (data) return;

                    let quote = [];
                    getQuotes().then(quoteData => quote.push(quoteData)).catch(e => console.error(`X | Error: ${e}`));

                    edunexRequest({ path: `/course/modules/${todo.tasks[i].taskable_id}` })
                    .then((modules) => {
                        edunexRequest({ path:`/course/courses/${modules.data.attributes.course_id}?include=lecturer,lecturer.user` })
                        .then((course) => { 
                            sendEmail({
                                nama_dosen: course.data.attributes.lecturer, 
                                mata_kuliah: `${todo.tasks[i].course} (${todo.tasks[i].code})`,
                                nama_tugas: modules.data.attributes.name,
                                deadline: moment(todo.tasks[i].time).tz('Asia/Jakarta').format('LLLL'), 
                                tanggal_upload: moment(Date.now()).tz('Asia/Jakarta').format('LLLL'),
                                quotes: `"${quote[0].quote}" (${quote[0].author})`,
                                url_edunex: `https://edunex.itb.ac.id/assignment/take/${todo.tasks[i].id}`,
                            })
                            .then(() => {
                                sendMessageTelegram(client, {
                                    nama_dosen: course.data.attributes.lecturer, 
                                    mata_kuliah: `${todo.tasks[i].course} (${todo.tasks[i].code})`,
                                    nama_tugas: modules.data.attributes.name,
                                    deadline: moment(todo.tasks[i].time).tz('Asia/Jakarta').format('LLLL'), 
                                    tanggal_upload: moment(Date.now()).tz('Asia/Jakarta').format('LLLL'),
                                    quotes: `"${quote[0].quote}" (${quote[0].author})`,
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
        };
    });
};