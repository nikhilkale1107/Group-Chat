const express = require("express");

const router = express.Router();

const Authenticate = require("../middleware/auth");

const groupController = require("../controllers/group");

router.get("/", Authenticate, groupController.getGroups);

router.get("/getmembers", Authenticate, groupController.getMembers);
  
router.get("/getNonMembers", Authenticate, groupController.getNonMembers);

module.exports = router;