// const express = require("express");
// const adidasLogic = require("../business-logic-layer/adidas-logic");

// const router = express.Router();

// router.get("/", async (request, response) => {
//     try {
//         const adidasItems = await adidasLogic.getAllAdidasAsync();
//         response.json(adidasItems);
//     } catch (err) {
//         response.status(500).send(err.message);
//     }
// });

// router.get("/:id", async (request, response) => {
//     try {
//         const id = +request.params.id;
//         const adidasItem = await adidasLogic.getOneAdidasAsync(id);
//         if (!adidasItem) {
//             response.status(404).send(`id ${id} is not found`);
//             return;
//         }
//         response.send(adidasItem);
//     } catch (err) {
//         response.status(500).send(err.message);
//     }
// });

// router.get("/hatsImage/:imageName", (request, response) => {
//     try {
//         const imageName = request.params.imageName;
//         const absolutePath = path.join(__dirname, ".." , "images/hatsImage" , imageName);
//         response.sendFile(absolutePath);
//     } catch (error) {
//         response.status(500).send(error.message);
//     }
// })

// //until we fix the MySQL
// // router.get("/imageAdidas/:imageName", (request, response) => {
// //     try {
// //         const imageName = request.params.imageName;
// //         const absolutePath = path.join(__dirname, ".." , "images/imageAdidas" , imageName);
// //         response.sendFile(absolutePath);
// //     } catch (error) {
// //         response.status(500).send(error.message);
// //     }
// // })

// module.exports = router;