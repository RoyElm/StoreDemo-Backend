const dal = require("../data-access-layer/dal");
const cryptoHelper = require("../helpers/crypto-helper");
const jwtHelper = require("../helpers/jwt-helper");


async function registerAsync(user) {

    //Checking if email exist;
    const verifyEmail = `SELECT email FROM users where email = ?`;
    const existingEmailSql = await dal.executeAsync(verifyEmail, [user.email]);
    if (existingEmailSql[0] !== undefined) return null;

    user.password = cryptoHelper.hash(user.password);
    // Solve SQL injection:
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?,DEFAULT)";
    await dal.executeAsync(sql, [user.firstName, user.lastName, user.email, user.password]);
    delete user.password;

    user.isAdmin = 0;
    // Generate JWT token to return to frontend:
    user.token = jwtHelper.getNewToken({ user });

    return user;
}

async function loginAsync(credentials) {

    // Hash user password: 
    credentials.password = cryptoHelper.hash(credentials.password);

    // Solve SQL injection by sending sql + values:
    const sql = "SELECT id, email,firstName, lastName,isAdmin FROM users WHERE email = ? AND password = ?";

    const users = await dal.executeAsync(sql, [credentials.email, credentials.password]);
    if (users.length === 0) return null;
    const user = users[0];

    // Generate JWT token to return to frontend:
    user.token = jwtHelper.getNewToken({ user });

    return user;
}

module.exports = {
    registerAsync,
    loginAsync
};