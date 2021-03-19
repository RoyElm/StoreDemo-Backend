const io = require("socket.io");

let socketServer;

function init(expressListener) {
    socketServer = io(expressListener, { cors: { origin: "*:*" } });
    socketServer.sockets.on("connection", socket => {
        console.log("Client Connected. Total clients: ", socketServer.engine.clientsCount);
        socket.on("disconnect", () => console.log("Client Disconnected. Total clients: ", socketServer.engine.clientsCount ? socketServer.engine.clientsCount - 1 : socketServer.engine.clientsCount));
    });
}

function itemAdded(addedItem) {
    socketServer.sockets.emit("msg-from-server-item-added", addedItem);
}

function itemUpdated(updatedItem) {
    socketServer.sockets.emit("msg-from-server-item-updated", updatedItem);
}

function itemDeleted(itemId) {
    socketServer.sockets.emit("msg-from-server-item-deleted", itemId);
}
function hatAdded(addedHat) {
    socketServer.sockets.emit("msg-from-server-hat-added", addedHat);
}

function hatUpdated(updatedHat) {
    socketServer.sockets.emit("msg-from-server-hat-updated", updatedHat);
}

function hatDeleted(hatId) {
    socketServer.sockets.emit("msg-from-server-hat-deleted", hatId);
}


module.exports = {
    init,
    itemAdded,
    itemUpdated,
    itemDeleted,
    hatAdded,
    hatUpdated,
    hatDeleted
};
