const express = require("express");
const verifyAdmin = require("../middleware/verify-admin");
const errorsHelper = require("../helpers/errors-helper");
const socketHelper = require("../helpers/socket-helper");
const path = require("path");
const hatLogic = require("../business-logic-layer/hats-logic");
const hatModel = require("../models/hats");

const router = express.Router();


router.get("/", async (request, response) => {
    try {
        const hats = await hatLogic.getAllHatsAsync();
        response.json(hats);
    } catch (error) {
        response.status(500).send(errorsHelper.getError(error));
    }
})

router.post("/", verifyAdmin, async (request, response) => {
    try {
        const hat = new hatModel(request.body);
        const error = hat.validatePost();
        if (error) return response.status(400).json(error);

        const addedHat = await hatLogic.addNewHatAsync(hat, request.files ? request.files.newImage : null);
        if (!addedHat) return response.status(400).send("Image doesn't exist or wrong file has been send");
        response.status(201).json(addedHat);
        socketHelper.hatAdded(addedHat);
    } catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

router.put("/:hatId", verifyAdmin, async (request, response) => {
    try {
        const hat = new hatModel(request.body);
        const error = hat.validatePut();
        if (error) return response.status(400).json(error);
        hat.hatId = +request.params.hatId;
        const editedHat = await hatLogic.updateFullHatAsync(hat, request.files ? request.files.newImage : null);
        if (editedHat === 404) return response.status(404).send("Hat Doesn't Exist");
        if (editedHat === 400) return response.status(404).send("Wrong file has been send");

        response.status(201).json(editedHat);
        socketHelper.hatUpdated(editedHat);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.get("/hatsImage/:imageName", (request, response) => {
    try {
        const { imageName } = request.params;
        const absolutePath = path.join(__dirname, "..", "images/hatsImage", imageName);
        response.sendFile(absolutePath);
    } catch (error) {
        response.status(500).send(error.message);
    }
})



router.delete("/:hatId", verifyAdmin, async (request, response) => {
    try {
        const hatId = +request.params.hatId;
        await hatLogic.deleteHatAsync(hatId);
        response.sendStatus(204);
        socketHelper.hatDeleted(hatId);
    } catch (error) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

module.exports = router
