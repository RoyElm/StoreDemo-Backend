const crypto = require("crypto");

const salt = "MakeThingsGoLeft";

function hash(plainText) {
    
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex");
}

module.exports = {
    hash
};
