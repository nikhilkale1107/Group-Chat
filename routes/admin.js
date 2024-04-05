const express = require("express");

const router = express.Router();

const Authenticate = require("../middleware/auth");

const adminController = require("../controllers/admin");

router.get("/make-admin", Authenticate, adminController.makeAdmin);

router.get("/remove-admin", Authenticate, adminController.removeAdmin);

module.exports = router;