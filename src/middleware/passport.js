const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const passportConfig = require("../config/passport/passport.config");

passport.use(
  new GoogleStrategy(passportConfig.googleAuth, function (issuer, profile, cb) {
    console.log(profile);
  })
);

module.exports = passport;
