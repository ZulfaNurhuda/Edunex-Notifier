const moment = require(`moment-timezone`);
const edunexRequest = require(`./edunexRequest`);
const DataTugas = require(`../Schema/dataTugasSchema`);
const sendEmail = require(`./sendEmail`);
const getQuotes = require(`./getQuotes`);

moment.locale(`id`);

module.exports = async () => {
    edunexRequest({ path: `/todo` }).then((todo) => {
        if (todo.tasks.length > 0) {
            for (let i in todo.task) {
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
                                url_edunex: `https://edunex.itb.ac.id/assignment/take/${r.tasks[i].id}}`,
                            })
                            .then(() => {
                                const dataTugas = new DataTugas({
                                    _id: new mongoose.Types.ObjectId(),
                                    main: JSON.stringify(r.tasks[i]),
                                });
                                dataTugas.save();
                            })
                            .catch(e => console.error(`X | Error: ${e}`));
                        });
                    });
                });
            };
        };
    });
};