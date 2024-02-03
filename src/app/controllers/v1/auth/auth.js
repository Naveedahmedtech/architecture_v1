// project external files

// project files
const {
  hashPassword,
  verifyPassword,
} = require("../../../../lib/common/bcrypt");
const { createOne } = require("../../../../utils/dbUtils/crud/createOne");
const {
  responseHandler,
} = require("../../../../utils/common/apiResponseHandler");
const { generateToken, verifyToken } = require("../../../../lib/common/jwt");
const {
  insertRecord,
  updateRecord,
} = require("../../../../utils/dbUtils/helper/dbOperations");
const {
  checkRecord,
  recordExists,
} = require("../../../../utils/dbUtils/helper/validationHelper");
const { setCookie } = require("../../../../utils/common/cookieHandler");
const {
  ACCESS_TOKEN_EXPIRY_SECONDS,
  MAX_AGE_REFRESH_TOKEN,
  MAX_AGE_ACCESS_TOKEN,
  REFRESH_TOKEN_EXPIRY_DAYS,
} = require("../../../../constants/auth");
const { logger } = require("../../../../config/logger/logger.config");
const { ERROR_MSGS } = require("../../../../constants/common");

// TODO: include role for registration, login, forgotPassword, change password, reset password, verify code
// TODO: make the verification code api for both forgot and email verification after registration

// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: MODIFY THE RESPONSE

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Check if user already registered
    await recordExists("users", [
      { field: "email", operator: "=", value: email },
    ]);
    const hashedPassword = await hashPassword(password);

    const data = {
      full_name: full_name,
      email: email,
      password: hashedPassword,
      role: role || "user",
    };

    await createOne(req, res, {
      tableName: "users",
      data: data,
      returnFields: "*", 
      excludeFields: ["password"],
    });
  } catch (error) {
    switch (error.message) {
      case "ALREADY_EXISTS":
        logger.error("ALREADY_EXISTS Error:", error);
        return responseHandler(req, res, 409, false, ERROR_MSGS.ALREADY_EXISTS);
      case "DatabaseQueryError":
        logger.error("DatabaseQuery Error:", error);
        return responseHandler(
          req,
          res,
          500,
          false,
          ERROR_MSGS.INTERNAL_SERVER_ERROR
        );
      default:
        logger.error("Registration Error:", error);
        return responseHandler(
          req,
          res,
          500,
          false,
          ERROR_MSGS.INTERNAL_SERVER_ERROR
        );
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Assuming the role should be either 'admin' or 'user'
    const validRole = role === "admin" || role === "user" ? role : "user";

    // Find user by email and role
    const user = await checkRecord("users", [
      { field: "email", operator: "=", value: email },
      { field: "role", operator: "=", value: validRole },
    ]);
    // Check if password matches
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return responseHandler(
        req,
        res,
        401,
        false,
        ERROR_MSGS.INVALID_CREDENTIALS
      );
    }

    // Generate JWT token with role
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(payload, ACCESS_TOKEN_EXPIRY_SECONDS);

    // Generate refresh token
    const refreshPayload = { id: user.id };
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

    return responseHandler(req, res, 200, true, "Login Successfully", {
      token,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    });
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(
          req,
          res,
          401,
          false,
          ERROR_MSGS.INVALID_CREDENTIALS
        );
        break;
      case "JWTGeneratorError":
        return responseHandler(req, res, 500, false, "Error creating token");
        break;
      default:
        console.error("Error in login process:", error);
        return responseHandler(req, res, 500, false, "Internal Server Error");
    }
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return responseHandler(res, 403, false, "Invalid refresh token");
    }

    // Check if the user still exists
    const user = await checkRecord("users", [
      { field: "id", operator: "=", value: decoded.id },
    ]);

    // Generate new access token
    const accessPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const newAccessToken = generateToken(accessPayload);

    return responseHandler(res, 200, true, "New token generated successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(res, 401, false, "Invalid authentication token");
      case "JWTVerificationError":
        const isExpiredError = error instanceof jwt.TokenExpiredError;
        return responseHandler(
          res,
          isExpiredError ? 403 : 401,
          false,
          isExpiredError ? "Token has expired" : "Invalid authentication token"
        );
      default:
        console.error("Error creating a new record:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};

/**
 * social login -- Assuming login with social handling by frontend dev
 * @param {*} req  provider, provider id, email, full name
 * @param {*} res access tokens and refresh tokens
 * @returns
 */
exports.socialLogin = async (req, res) => {
  try {
    const { email, full_name, provider, providerId } = req.body;

    // Check if user exists
    const userExists = await recordExists("users", [
      { field: "email", operator: "=", value: email },
    ]);

    let user;
    if (!userExists) {
      // Create new user
      const newUser = {
        email,
        full_name,
        provider,
        provider_id: providerId,
      };
      const userId = await insertRecord("users", newUser);
      user = { id: userId, email: newUser.email, username: newUser.username };
    } else {
      // Update user data
      const updatedUserData = { full_name };
      user = await updateRecord("users", updatedUserData, [
        { field: "email", operator: "=", value: email },
      ]);
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, name: user.full_name };
    const token = generateToken(payload);

    // Generate refresh token
    const refreshPayload = { id: user.id };
    const refreshToken = generateToken(refreshPayload, "180d");

    return responseHandler(res, 201, true, "Login successful", {
      token,
      refreshToken,
    });
  } catch (error) {
    switch (error.message) {
      case "DatabaseQueryError":
        return responseHandler(res, 500, false, "Database query error");
      case "UpdateDataMissing":
        return responseHandler(res, 400, false, "No update data provided");
      case "UpdateFilterMissing":
        return responseHandler(
          res,
          400,
          false,
          "No valid filter provided for update"
        );
      case "RecordNotFound":
        return responseHandler(res, 404, false, "Record not found");
      case "UpdateDatabaseQueryError":
        return responseHandler(
          res,
          500,
          false,
          "Database query error during update"
        );
      default:
        console.error("Registration Error:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  try {
  } catch (error) {}
};
