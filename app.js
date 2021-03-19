global.config = require(process.env.NODE_ENV === "production" ? "./env/config-prod.json" : "./env/config-dev.json");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const hatController = require("./controller-layer/hats-controller");
const itemsController = require("./controller-layer/items-controller");
const authController = require("./controller-layer/auth-controller");
const socketHelper = require("./helpers/socket-helper");
const cookieParser = require("cookie-parser");

const server = express();

server.use(cookieParser());

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "./frontend")));
server.use(fileUpload());

server.use("/api/store/hats", hatController);
server.use("/api/store/items", itemsController);
server.use("/api/auth", authController);

server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, "./frontend/index.html"));
});

const port = process.env.PORT || 3001;

const expressListener = server.listen(port, () => console.log("Listening..."));
socketHelper.init(expressListener);
