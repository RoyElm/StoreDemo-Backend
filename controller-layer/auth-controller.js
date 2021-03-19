const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const UserModel = require("../models/userModel");
const errorsHelper = require("../helpers/errors-helper");

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        const newUser = new UserModel(request.body);
        const error = newUser.validateRegister();
        if (error) return response.status(404).send(error.message);
        const addedUser = await authLogic.registerAsync(newUser);
        if (!addedUser) return response.status(401).send("Try Different email Or Password");
        response.status(201).json(addedUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/login", async (request, response) => {
    try {
        const user = new UserModel(request.body);
        const error = user.validateLogin();
        if (error) {
            response.status(404).send(error.message);
            return;
        };
        const loggedInUser = await authLogic.loginAsync(user);
        if (!loggedInUser) return response.status(401).send("Incorrect email or password.");
        response.json(loggedInUser);
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;