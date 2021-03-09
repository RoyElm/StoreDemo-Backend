const dal = require("../data-access-layer/dal");
const uuid = require("uuid");

async function getAllWoolfitItemsAsync() {
    const sql = `SELECT * FROM hats`;
    const woolfitItems = await dal.executeAsync(sql);
    return woolfitItems;
}

// Get one Item: 
async function getOneWoolfitItemAsync(id) {
    const sql = `SELECT * FROM hats WHERE hatId = ?`;
    const woolfitItem = await dal.executeAsync(sql, [id]);
    return woolfitItem[0];
}

async function updateFullItemAsync(item, image) {

    if (image) {
        await fs.unlinkSync("./images/itemImages/" + item.imageFileName);
        const extension = image.name.substr(image.name.lastIndexOf("."));
        item.imageFileName = uuid.v4() + extension;
        await image.mv("./images/itemImages/" + item.imageFileName);
    }

    const sql = `UPDATE items SET price = ?, stock = ? , imageFileName = ? WHERE itemId = ?`;

    const info = await dal.executeAsync(sql, [item.price, item.stock, item.imageFileName]);

    hat = await getOneWoolfitItemAsync(item.itemId);
    return info.affectedRows === 0 ? null : vacation;
}

async function addNewItemAsync(item, image) {
    let newFileName = ""

    if (image) {
        const extension = image.name.substr(image.name.lastIndexOf("."));
        newFileName = uuid.v4() + extension;
        await image.mv("./images/" + newFileName);
    }

    const sql = `INSERT INTO Hats VALUES(DEFAULT,?,?,?)`;
    const info = await dal.executeAsync(sql, [item.stock, item.price, newFileName]);
    item.itemId = info.insertId;
    item.imageName = newFileName;
    return item;
}

async function deleteItemAsync(id) {
    const sql = `DELETE FROM Items WHERE itemId = ?`
    await dal.executeAsync(sql, [id]);
    return;
}

module.exports = {
    getAllWoolfitItemsAsync,
    getOneWoolfitItemAsync,
    addNewItemAsync,
    deleteItemAsync,
    updateFullItemAsync
}