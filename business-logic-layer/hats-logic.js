const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

async function getAllHatsAsync() {
    const sql = `SELECT * FROM hats`;
    const hats = await dal.executeAsync(sql);
    return hats;
}

// Get one Hat: 
async function getOneHatAsync(id) {
    const sql = `SELECT * FROM hats WHERE hatId = ?`;
    const hat = await dal.executeAsync(sql, [id]);
    return hat[0];
}

async function addNewHatAsync(hat, image) {

    let newFileName = ""

    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        newFileName = uuid.v4() + extension;
        await image.mv("./images/hatsImage/" + newFileName);
    }

    const sql = `INSERT INTO Hats VALUES(DEFAULT,?,?,?)`;
    const info = await dal.executeAsync(sql, [hat.stock, hat.price, newFileName]);
    hat.hatId = info.insertId;
    hat.imageName = newFileName;
    return hat;
}

// Update full Hat: 
async function updateFullHatAsync(hat, image) {

    if (image) {
        await fs.unlinkSync("./images/hatsImage/" + hat.imageFileName);
        const extension = image.name.substr(image.name.lastIndexOf("."));
        hat.imageFileName = uuid.v4() + extension;
        await image.mv("./images/hatsImage/" + hat.imageFileName);
    }

    const sql = `UPDATE hats SET price = ?, stock = ? , imageFileName = ? WHERE hatId = ?`;

    const info = await dal.executeAsync(sql, [hat.price, hat.stock, hat.imageFileName]);

    hat = await getOneHatAsync(hat.hatId);
    return info.affectedRows === 0 ? null : hat;
}


async function deleteHatAsync(id) {
    const sql = `DELETE FROM Hats WHERE hatId = ?`
    await dal.executeAsync(sql, [id]);
    return;
}


module.exports = {
    getAllHatsAsync,
    getOneHatAsync,
    addNewHatAsync,
    deleteHatAsync,
    updateFullHatAsync
}