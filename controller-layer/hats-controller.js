const express = require("express");
const hatLogic = require("../business-logic-layer/hats-logic");
const path = require("path");
const { response } = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const socketHelper = require("../helpers/socket-helper");
const Hat = require("../models/hats");

const router = express.Router();


router.get("/", async (request, response) => {
    try {
        const hats = await hatLogic.getAllHatsAsync();
        response.json(hats);
    } catch (error) {
        response.status(500).send(error.message)
    }
})

router.put("/:hatId", verifyLoggedIn, async (request, response) => {
    try {
        const hat = new Hat(request.body);
        const error = hat.validatePost();
        if (error) return response.status(404).send(error.message);
        hat.hatId = +request.params.hatId;

        const editedHat = await hatLogic.addNewHatAsync(hat, request.files ? request.files.newImage : null);
        response.status(201).json(editedHat);
        socketHelper.hatUpdated(editedHat);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

// router.get("/:id", async (request, response) => {
//     try {
//         const id = +request.params.id;
//         const hat = await hatLogic.getOneHatAsync(id);
//         if (!hat) {
//             response.status(404).send(`Hat id ${id} not found.`);
//             return;
//         }
//         response.json(hat);
//     } catch (error) {
//         response.status(500).send(error.message)
//     }
// })

router.get("/hatsImage/:imageName", (request, response) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "images/hatsImage", imageName);
        response.sendFile(absolutePath);
    } catch (error) {
        response.status(500).send(error.message);
    }
})

router.post("/", verifyLoggedIn, async (request, response) => {
    try {
        const hat = request.body;
        const addedHat = await hatLogic.addNewHatAsync(hat);
        response.status(201).json(addedHat);
        socketHelper.hatAdded(addedHat);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.delete("/:id", verifyLoggedIn, async (request, response) => {
    try {
        const id = +request.params.id;
        await hatLogic.deleteHatAsync(id);
        response.sendStatus(204);
        socketHelper.hatDeleted(id);
    } catch (error) {
        response.status(500).send(error.message)
    }
})

module.exports = router
