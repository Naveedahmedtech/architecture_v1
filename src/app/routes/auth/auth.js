// project external files
const express = require("express");
const router = express.Router();


// controller
const authController = require("../../controllers/auth/auth");

// middlewares
const validateRequest = require("../../../middleware/validator");
const passport = require("../../../middleware/passport");

// validations
const schemas = require("../../../lib/validations/bodyValidation");



router.post("/register", validateRequest(schemas.register), authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/socialLogin", authController.socialLogin);


// OAUTH LOGIN
router.get("/login/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    // failureRedirect: "/login",
    failureFlash: true,
  }),
    (req, res) => {
      try {
          // Check for flash messages (errors)
          const errors = req.flash("error");
          if (errors.length > 0) {
            console.log("Google Auth Error: ", errors.join("; "));
            // Handle the error
          }
          // Successful authentication
          res.send("LOGIN");
        
      } catch (error) {
        console.log(error);
      }
  }
);



module.exports = router;
