// const dal = require("../data-access-layer/dal");

// async function getAllAdidasAsync() {
//     const sql = `SELECT * FROM hats`;
//     const adidasItems = await dal.executeAsync(sql);
//     return adidasItems;
// }

// // Get one product: 
// async function getOneAdidasAsync(id) {
//     const sql = `SELECT * FROM hats WHERE hatId = ${id}`;
//     const adidasItem = await dal.executeAsync(sql);
//     return adidasItem[0];
// }

// module.exports = {
//     getAllAdidasAsync,
//     getOneAdidasAsync
// }