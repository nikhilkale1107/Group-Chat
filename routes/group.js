const express = require("express");

const router = express.Router();

const Authenticate = require("../middleware/auth");

const groupController = require("../controllers/group");

router.get("/", Authenticate, groupController.getGroups);

module.exports = router;