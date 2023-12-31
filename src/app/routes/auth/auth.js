// project external files
const express = require("express");
const router = express.Router();

// project files
const authController = require("../../controllers/auth/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
