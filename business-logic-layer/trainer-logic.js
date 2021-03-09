const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

async function getAllTrainersAsync() {
    const sql = `SELECT * FROM trainers`;
    const trainers = await dal.executeAsync(sql);
    return trainers;
}

async function getOneMethodAsync(trainerId) {
    const sql = `SELECT * FROM trainers WHERE trainerId = ?`;
    const method = await dal.executeAsync(sql, [trainerId]);
    return method[0];
}


async function addNewTrainerAsync(trainer, image) {

    let newImageName = "";

    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        newImageName = uuid.v4() + extension;
        await image.mv("./images/trainerImages/" + newImageName);
    }

    const sql = `INSERT INTO trainers VALUES(DEFAULT,?,?)`;
    const info = await dal.executeAsync(sql, [trainer.review, newImageName]);
    trainer.trainerId = info.insertId;
    trainer.trainerImage = newImageName;
    return trainer;
}

async function updateFullMethodAsync(method, image) {

    if (image) {
        await fs.unlinkSync("./images/trainerImages/" + method.imageFileName);
        const extension = image.name.substr(image.name.lastIndexOf("."));
        hat.imageFileName = uuid.v4() + extension;
        await image.mv("./images/trainerImages/" + method.imageFileName);
    }

    const sql = `UPDATE trainers SET review = ?, imageFileName = ? WHERE trainerId = ?`;

    const info = await dal.executeAsync(sql, [method.review, method.imageFileName, method.trainerId]);

    method = await getOneMethodAsync(method.methodId);
    return info.affectedRows === 0 ? null : method;
}

async function deleteTrainerAsync(trainerId) {
    const sql = `DELETE FROM trainers WHERE trainerId = ?`;
    await dal.executeAsync(sql, [trainerId]);
    return;
}

module.exports = {
    getAllTrainersAsync,
    addNewTrainerAsync,
    updateFullMethodAsync,
    deleteTrainerAsync
}