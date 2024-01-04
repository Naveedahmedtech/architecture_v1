// project external files
const express = require("express");
const router = express.Router();

// project files
const authController = require("../../controllers/auth/auth");
const validateRequest = require("../../../middleware/validator");
const schemas = require("../../../lib/validations/bodyValidation");

router.post("/register", validateRequest(schemas.register), authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/socialLogin", authController.socialLogin);

module.exports = router;
