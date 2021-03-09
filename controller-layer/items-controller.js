const express = require("express");
const itemsLogic = require("../business-logic-layer/items-logic");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const Item = require("../models/items");
const socketHelper = require("../helpers/socket-helper");
const errorsHelper = require("../helpers/errors-helper");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const itemsWoolf = await itemsLogic.getAllWoolfitItemsAsync();
        response.json(itemsWoolf);
    } catch (err) {
        response.status(500).send(err.message);
    }
});

router.put("/:itemId", verifyLoggedIn, async (request, response) => {
    try {
        const item = new Item(request.body);
        const error = item.validatePost();
        if (error) return response.status(404).send(error.message);
        item.itemId = +request.params.itemId;

        const editedItem = await itemsLogic.addNewItemAsync(item, request.files ? request.files.newImage : null);
        response.status(201).json(editedItem);
        socketHelper.itemUpdated(editedItem)
    }
    catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/", verifyLoggedIn, async (request, response) => {
    try {
        const item = new Item(request.body);
        const error = item.validatePost();
        if (error) return response.status(404).send(error.message);
        const addedItem = await itemsLogic.addNewItemAsync(item);
        response.status(201).json(addedItem);
        socketHelper.itemAdded(addedItem);

    } catch (err) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

router.delete("/:itemId", verifyLoggedIn, async (request, response) => {
    try {
        const { itemId } = +request.params;
        await itemsLogic.deleteItemAsync(itemId);
        response.sendStatus(204);
        socketHelper.itemDeleted(itemId);

    } catch (error) {
        response.status(500).send(errorsHelper.getError(err));
    }
})

// router.get("/:id", async (request, response) => {
//     try {
//         const id = +request.params.id;
//         const itemWoolf = await itemsLogic.getOneWoolfitItemAsync(id);
//         if (!itemWoolf) {
//             response.status(404).send(`id ${id} is not found`);
//             return;
//         }
//         response.send(itemWoolf);
//     } catch (err) {
//         response.status(500).send(err.message);
//     }
// });

//Until we fix the SQL
// router.get("/woolfitImages/:imageName", (request, response) => {
//     try {
//         const imageName = request.params.imageName;
//         const absolutePath = path.join(__dirname, ".." , "images/woolfitImages" , imageName);
//         response.sendFile(absolutePath);
//     } catch (error) {
//         response.status(500).send(error.message);
//     }
// })

module.exports = router;