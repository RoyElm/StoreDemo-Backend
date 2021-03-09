const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const uuid = require("uuid");

// async function registerAsync(user) {
//     user.password = cryptoHelper.hash(user.password);
//     user.uuid = uuid.v4();
//     const sql = `INSERT INTO users VALUES(DEFAULT,?,?, ?, ?, ?)`;
//     /* const info = */await dal.executeAsync(sql, [user.uuid, user.firstName, user.lastName, user.email, user.password]);

//     //Don't send back to frontend the Auto Increment ID!
//     // user.id = info.insertId;

//     //Delete the password;
//     delete user.password;
//     // user.token = jwtHelper.getNewToken(user)

//     return user;
// }

async function loginAsync(credentials) {

    //Not Recommended because need to do it for each string!;
    // credentials.username = credentials.username.replace(/'/g, "''");
    // credentials.password = credentials.password.replace(/'/g, "''");

    credentials.password = cryptoHelper.hash(credentials.password);
    //Canceling the returning of all details 
    // const sql = `SELECT uuid,firstName,lastName,username FROM users WHERE username = '${credentials.username}' AND password = '${credentials.password}'`;

    const sql = `SELECT uuid,firstName,lastName,email FROM users WHERE email = ? AND password = ?`;
    const users = await dal.executeAsync(sql, [credentials.email, credentials.password]);
    if (users.length === 0) return null;
    const user = users[0];

    // user.token = jwtHelper.getNewToken(user)

    return user;
}

module.exports = {
    // registerAsync,
    loginAsync
};