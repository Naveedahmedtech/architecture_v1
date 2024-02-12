// project external files
const express = require("express");
const router = express.Router();


// controller
const authController = require("../../../controllers/v1/auth/auth");

// middlewares
const validateRequest = require("../../../../middleware/validator");
const passport = require("../../../../middleware/passport");

// validations
const schemas = require("../../../../lib/validations/bodyValidation");
const { verifyApiKey } = require("../../../../middleware/apiKey");



router.post("/register", verifyApiKey, validateRequest(schemas.register), authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/socialLogin", authController.socialLogin);


// OAUTH LOGIN
router.get("/login/google", passport.authenticate("google"));

router.get("/google/callback", passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;
