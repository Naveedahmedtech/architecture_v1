const { verifyToken } = require("../lib/common/jwt");
const { responseHandler } = require("../utils/common/apiResponseHandler");

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler(
        res,
        500,
        false,
        "No token provided or invalid format"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);
    // TODO: If token is valid then check user existence in the database -- more secure 
    req.user = decoded;

    next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return responseHandler(res, 401, false, "Token has expired");
      case "JsonWebTokenError":
        return responseHandler(res, 401, false, "Invalid token");
      default:
        console.error("Error in authGuard:", error);
        return responseHandler(
          res,
          500,
          false,
          "Error while authenticating headers"
        );
    }
  }
};

module.exports = authGuard;
