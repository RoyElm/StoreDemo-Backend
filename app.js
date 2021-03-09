global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const hatController = require("./controller-layer/hats-controller");
const itemsController = require("./controller-layer/items-controller");
const authController = require("./controller-layer/auth-controller");
const trainersController = require("./controller-layer/trainer-controller");
const socketHelper = require("./helpers/socket-helper");

const server = express();

server.use(cors());
server.use(express.json()); // Create "body" property from the given JSON.
server.use(express.static(path.join(__dirname, "./frontend")));
server.use(fileUpload());

server.use("/api/store/hats", hatController);
server.use("/api/store/items", itemsController);
server.use("/api/auth", authController);
server.use("/api/trainers", trainersController);

server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./frontend/index.html"));
});

const port = process.env.PORT || 3001;
const expressListener = server.listen(port, () => console.log("Listening..."));
socketHelper.init(expressListener);
//hello shemer

// const coupons = [];
// for (let i = 0; i < 20; i++) {
//     coupons.push(coupongenerator());
// }

// function coupongenerator() {
//     let coupon = "";
//     let latters = "abcdefghijklmnopqrstuvwxyz0123456789";
//     for (let i = 0; i < 8; i++) {
//         coupon += latters[Math.floor(Math.random() * latters.length)];
//     }
//     return coupon;
// }

