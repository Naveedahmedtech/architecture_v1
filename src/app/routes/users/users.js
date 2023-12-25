// project external files
const express = require("express");
const router = express.Router();

// project files
const userController = require("../../controllers/users/users");

router.post("/register", userController.register);
// router.post("/signIn",  userController.signIn);

module.exports = router;
