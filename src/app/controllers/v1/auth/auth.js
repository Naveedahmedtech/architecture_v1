// project external files

// project files
const { TABLES } = require("../../../../constants/common");
const {
  buildDataObject,
  createRecord,
  handleAddError,
  sendSuccessResponse,
} = require("../../../../utils/common/crudHeloper/createRecordHelper");
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
const { ACCESS_TOKEN_EXPIRY_SECONDS } = require("../../../../constants/auth");
const { logger } = require("../../../../config/logger/logger.config");
const { ERROR_MSGS } = require("../../../../constants/common");
const { handleToken, handleRefreshTokenErrors } = require("./utils/helper");

// TODO: include role for registration, login, forgotPassword, change password, reset password, verify code
// TODO: make the verification code api for both forgot and email verification after registration

// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: MODIFY THE RESPONSE

const TABLE_NAME = TABLES.USER;

exports.register = async (req, res) => {
  const { email } = req.body;
  try {
    await recordExists("users", [
      { field: "email", operator: "=", value: email },
    ]);
    const data = await buildDataObject(req, TABLE_NAME);
    const hashedPassword = await hashPassword(data.password);
    delete data.password;
    data.password = hashedPassword;
    const createdRecord = await createRecord(req, res, data, TABLE_NAME);
    return sendSuccessResponse(
      req,
      res,
      "created record successfully",
      createdRecord
    );
  } catch (error) {
    handleAddError(req, res, error);
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
    logger.info({ code: "checked_record", user: user });
    const { token, refreshToken } = await handleToken(
      res,
      user.id,
      user.email,
      user.username,
      user.role
    );

    return responseHandler(req, res, 200, true, "Login Successfully", {
      token,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    });
  } catch (error) {
    handleAddError(req, res, error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return responseHandler(req, res, 403, false, "Invalid refresh token");
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

    return responseHandler(req, res, 200, true, "New token generated successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    handleRefreshTokenErrors(req, res, error);
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

    return responseHandler(res, 201, false, "Login successful", {
      token,
      refreshToken,
    });
  } catch (error) {
    switch (error.message) {
      case "DatabaseQueryError":
        return responseHandler(res, 500, true, "Database query error");
      case "UpdateDataMissing":
        return responseHandler(res, 400, true, "No update data provided");
      case "UpdateFilterMissing":
        return responseHandler(
          res,
          400,
          true,
          "No valid filter provided for update"
        );
      case "RecordNotFound":
        return responseHandler(res, 404, true, "Record not found");
      case "UpdateDatabaseQueryError":
        return responseHandler(
          res,
          500,
          true,
          "Database query error during update"
        );
      default:
        console.error("Registration Error:", error);
        return responseHandler(res, 500, true, "Internal Server Error");
    }
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  try {
  } catch (error) {}
};
