const express = require("express");
const verifyAdmin = require("../middleware/verify-admin");
const errorsHelper = require("../helpers/errors-helper");
const socketHelper = require("../helpers/socket-helper");
const path = require("path");
const itemModel = require("../models/items");
const itemsLogic = require("../business-logic-layer/items-logic");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const items = await itemsLogic.getAllItemsAsync();
        response.json(items);
    } catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/", verifyAdmin, async (request, response) => {
    try {
        const item = new itemModel(request.body);
        const error = item.validatePost();
        if (error) return response.status(400).json(error);
        const addedItem = await itemsLogic.addNewItemAsync(item, request.files ? request.files.newImage : null);
        if (!addedItem) return response.status(400).send("Image doesn't exist or wrong file has been send");
        response.status(201).json(addedItem);
        socketHelper.itemAdded(addedItem);

    } catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

router.put("/:itemId", verifyAdmin, async (request, response) => {
    try {
        const item = new itemModel(request.body);
        const error = item.validatePut();
        if (error) return response.status(400).json(error);
        item.itemId = +request.params.itemId;
        const editedItem = await itemsLogic.updateFullItemAsync(item, request.files ? request.files.newImage : null);
        if (editedItem === 404) return response.status(404).send("Vacation Doesn't Exist");
        if (editedItem === 400) return response.status(404).send("Wrong file has been send");
        response.json(editedItem);
        socketHelper.itemUpdated(editedItem)
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.delete("/:itemId", verifyAdmin, async (request, response) => {
    try {
        const itemId = +request.params.itemId;
        await itemsLogic.deleteItemAsync(itemId);
        response.sendStatus(204);
        socketHelper.itemDeleted(itemId);
    } catch (error) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

router.get("/itemImages/:imageName", (request, response) => {
    try {
        const { imageName } = request.params;
        const absolutePath = path.join(__dirname, "..", "images/itemImages", imageName);
        response.sendFile(absolutePath);
    } catch (error) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

module.exports = router;