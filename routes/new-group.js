const express = require("express");

const router = express.Router();

const Authenticate = require("../middleware/auth");

const groupChatController = require("../controllers/new-group");

router.post("/", Authenticate, groupChatController.postNewGroup);

router.get("/users", Authenticate, groupChatController.getUsers);

router.get("/add-user", Authenticate, groupChatController.addUserToGroup);

router.delete("/delete-user", Authenticate, groupChatController.deleteUserFromGroup);

router.post("/edit-group", Authenticate,groupChatController.postUpdateGroup);

module.exports = router;