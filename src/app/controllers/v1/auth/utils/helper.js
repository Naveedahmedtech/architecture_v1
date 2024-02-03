const { logger } = require("../../../../../config/logger/logger.config");
const {
  ACCESS_TOKEN_EXPIRY_SECONDS,
  MAX_AGE_REFRESH_TOKEN,
  MAX_AGE_ACCESS_TOKEN,
  REFRESH_TOKEN_EXPIRY_DAYS,
} = require("../../../../../constants/auth");
const { generateToken } = require("../../../../../lib/common/jwt");
const { setCookie } = require("../../../../../utils/common/cookieHandler");

const handleToken = async (res, id, email, username, role) => {
  try {
    const payload = {
      id: id,
      email: email,
      username: username,
      role: role,
    };
    const token = generateToken(payload, ACCESS_TOKEN_EXPIRY_SECONDS);

    // Generate refresh token
    const refreshPayload = { id: id };
    const refreshToken = generateToken(
      refreshPayload,
      REFRESH_TOKEN_EXPIRY_DAYS
    );

    setCookie(res, "token", token, MAX_AGE_ACCESS_TOKEN);
    setCookie(res, "refreshToken", refreshToken, MAX_AGE_REFRESH_TOKEN);
    setCookie(
      res,
      "expiresIn",
      ACCESS_TOKEN_EXPIRY_SECONDS,
      MAX_AGE_ACCESS_TOKEN
    );

    logger.info({ token, refreshToken });
    return {
      token: token,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleToken,
};
