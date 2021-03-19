const dal = require("../data-access-layer/dal");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

async function getAllHatsAsync() {
    const sql = `SELECT * FROM hats`;
    const hats = await dal.executeAsync(sql);
    return hats;
}

// Get one Hat: 
async function getOneHatAsync(hatId) {
    const sql = `SELECT * FROM hats WHERE hatId = ?`;
    const hat = await dal.executeAsync(sql, [hatId]);
    return hat[0];
}

async function addNewHatAsync(hat, image) {
    //Check image extension
    const regex = /\.(gif|jpg|jpeg|tiff|png|ico|xbm|tif|svgz|jif|svg|jfif|webp|bmp|pjpeg|avif)$/i;
    if (image && !path.extname(image.name).match(regex) || !image) return null;

    // Save image to the disk: 
    const extension = path.extname(image.name);
    hat.imageName = uuid.v4() + extension;
    await image.mv("images/hatsImage/" + hat.imageName);

    const sql = `INSERT INTO hats VALUES(DEFAULT,?,?,?)`;
    const info = await dal.executeAsync(sql, [hat.colors, hat.price, hat.imageName]);
    hat.hatId = info.insertId;
    return hat;
}
// Update full Hat: 
async function updateFullHatAsync(hat, image) {
    if (!hat.imageName)
        hat.imageName = await getImageNameAsync(hat.hatId);

    //Check image extension
    const regex = /\.(gif|jpg|jpeg|tiff|png|ico|xbm|tif|svgz|jif|svg|jfif|webp|bmp|pjpeg|avif)$/i;

    if (image) {
        if (!path.extname(image.name).match(regex)) return 400;
        const absolutePath = path.join(__dirname, "..", "images/hatsImage/", hat.imageName);
        if (await fs.existsSync(absolutePath)) {
            await fs.unlinkSync(absolutePath);
            const extension = path.extname(image.name);
            hat.imageName = uuid.v4() + extension;
            await image.mv("images/hatsImage/" + hat.imageName);
        }
    }

    const sql = `UPDATE hats SET colors = ? , price = ?, imageName = ? WHERE hatId = ?`;

    const info = await dal.executeAsync(sql, [hat.colors, hat.price, hat.imageName, hat.hatId]);

    hat = await getOneHatAsync(hat.hatId);
    return !info.affectedRows ? 404 : hat;
}

async function getImageNameAsync(hatId) {
    const imageSql = `SELECT imageName FROM hats WHERE hatId = ?`;
    const response = await dal.executeAsync(imageSql, [hatId]);
    if (!response.length) return null
    return response[0].imageName;
}

async function deleteHatAsync(hatId) {
    const imageName = await getImageNameAsync(hatId);
    let absolutePath;
    if (imageName)
        absolutePath = path.join(__dirname, "..", "images/hatsImage/", imageName);
    if (await fs.existsSync(absolutePath)) await fs.unlinkSync(absolutePath);
    const sql = `DELETE FROM Hats WHERE hatId = ?`
    await dal.executeAsync(sql, [hatId]);
}


module.exports = {
    getAllHatsAsync,
    getOneHatAsync,
    addNewHatAsync,
    deleteHatAsync,
    updateFullHatAsync
}