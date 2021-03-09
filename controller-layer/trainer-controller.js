const express = require("express");
const trainerLogic = require("../business-logic-layer/trainer-logic");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const Trainer = require("../models/trainers");
const socketHelper = require("../helpers/socket-helper");
const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const trainers = await trainerLogic.getAllTrainersAsync();
        response.json(trainers);
    } catch (error) {
        response.status(500).send(error.message)
    }
});

router.get("/trainerImage/:imageName", (request, response) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "images/trainerImages", imageName);
        response.sendFile(absolutePath);
    } catch (error) {
        response.status(500).send(error.message);
    }
});

router.post("/", verifyLoggedIn, async (request, response) => {
    try {
        const trainer = new Trainer(request.body);
        const error = trainer.validatePost();
        if (error) return response.status(404).send(error.message);
        const addedTrainer = await trainerLogic.addNewTrainerAsync(trainer, request.files ? request.files.myImage : null);
        response.status(201).json(addedTrainer);
        socketHelper.tainerAdded(addedTrainer);
    } catch (err) {
        response.status(500).send(err.message)
    }
});

router.put("/:trainerId", verifyLoggedIn, async (request, response) => {
    try {
        const method = new Trainer(request.body);
        const error = method.validatePut();
        if (error) return response.status(404).send(error.message);
        method.trainerId = +request.params.trainerId;

        const editedMethod = await trainerLogic.updateFullMethodAsync(method, request.files ? request.files.newImage : null);
        response.status(201).json(editedMethod);
        socketHelper.trainerUpdated(editedMethod)
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.delete("/:trainerId", verifyLoggedIn, async (request, response) => {
    try {
        const { trainerId } = +request.params;
        await itemsLogic.deleteItemAsync(trainerId);
        response.sendStatus(204);
        socketHelper.trainerDeleted(trainerId);

    } catch (error) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;