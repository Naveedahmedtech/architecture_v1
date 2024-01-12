// project external files
const express = require("express");
const router = express.Router();

// project files
const userController = require("../../controllers/users/users");
const authGuard = require("../../../middleware/authGaurd");

router.get("/getAll", authGuard, userController.getAll);

module.exports = router;