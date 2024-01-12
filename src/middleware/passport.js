const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const passportConfig = require("../config/passport/passport.config");

passport.use(
  new GoogleStrategy(passportConfig.googleAuth, function (issuer, profile, cb) {
    try {
      console.log("User profile", profile);
      console.log("issuer", issuer);
      return cb(null, profile)
      
    } catch (error) {
      return cb(null, error)
    }
  })
);

module.exports = passport;
