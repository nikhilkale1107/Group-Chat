const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");

const Authenticate = require("../middleware/auth");

router.post("/", Authenticate, chatController.postChat);

module.exports = router;