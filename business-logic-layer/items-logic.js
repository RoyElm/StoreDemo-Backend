const dal = require("../data-access-layer/dal");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");


async function getAllItemsAsync() {
    const sql = `SELECT * FROM items`;
    const items = await dal.executeAsync(sql);
    return items;
}

// Get one Item: 
async function getOneItemAsync(id) {
    const sql = `SELECT * FROM items WHERE itemId = ?`;
    const item = await dal.executeAsync(sql, [id]);
    return item[0];
}

async function updateFullItemAsync(item, image) {

    if (!item.imageName)
        item.imageName = await getImageNameAsync(item.itemId);

    //Check image extension
    const regex = /\.(gif|jpg|jpeg|tiff|png|ico|xbm|tif|svgz|jif|svg|jfif|webp|bmp|pjpeg|avif)$/i;

    if (image) {
        if (!path.extname(image.name).match(regex)) return 400;
        const absolutePath = path.join(__dirname, "..", "images/itemImages/", item.imageName);
        if (await fs.existsSync(absolutePath)) {
            await fs.unlinkSync(absolutePath);
            const extension = path.extname(image.name);
            item.imageName = uuid.v4() + extension;
            await image.mv("images/itemImages/" + item.imageName);
        }
    }

    const sql = `UPDATE items SET itemName = ? , description = ?, colors = ? ,itemPrice = ? , imageName = ? WHERE itemId = ?`;
    const info = await dal.executeAsync(sql, [item.itemName, item.description, item.colors, item.itemPrice, item.imageName, item.itemId]);

    item = await getOneItemAsync(item.itemId);
    return !info.affectedRows ? 404 : item;
}

//Get imageName from server by specific itemId
async function getImageNameAsync(itemId) {
    const imageSql = `SELECT imageName FROM items WHERE itemId = ?`;
    const response = await dal.executeAsync(imageSql, [itemId]);
    if (!response.length) return null
    return response[0].imageName;
}

async function addNewItemAsync(item, image) {

    //Check image extension
    const regex = /\.(gif|jpg|jpeg|tiff|png|ico|xbm|tif|svgz|jif|svg|jfif|webp|bmp|pjpeg|avif)$/i;
    if (image && !path.extname(image.name).match(regex) || !image) return null;

    // Save image to the disk: 
    const extension = path.extname(image.name);
    item.imageName = uuid.v4() + extension;
    await image.mv("images/itemImages/" + item.imageName);


    const sql = `INSERT INTO items VALUES(DEFAULT,?,?,?,?,?)`;
    const info = await dal.executeAsync(sql, [item.itemName, item.description, item.colors, item.itemPrice, item.imageName]);
    item.itemId = info.insertId;
    return item;
}

async function deleteItemAsync(itemId) {
    const imageName = await getImageNameAsync(itemId);
    let absolutePath;
    if (imageName)
        absolutePath = path.join(__dirname, "..", "images/itemImages/", imageName);
    if (await fs.existsSync(absolutePath)) await fs.unlinkSync(absolutePath);
    const sql = `DELETE FROM Items WHERE itemId = ?`;
    await dal.executeAsync(sql, [itemId]);
}

module.exports = {
    getAllItemsAsync,
    getOneItemAsync,
    updateFullItemAsync,
    addNewItemAsync,
    deleteItemAsync
}