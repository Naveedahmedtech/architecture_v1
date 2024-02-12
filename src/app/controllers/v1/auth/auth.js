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
<<<<<<< HEAD:src/app/controllers/auth/auth.js

    if (userExists) {
      return responseHandler(res, 409, true, "User already exists");
    } else {
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
    }
  } catch (error) {
    switch (error.message) {
      case "DatabaseQueryError":
        return responseHandler(res, 500, true, "Database query error");
      default:
        console.error("Registration Error:", error);
        return responseHandler(res, 500, true, "Internal Server Error");
    }
=======
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
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
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
<<<<<<< HEAD:src/app/controllers/auth/auth.js
    if (!user) {
      return responseHandler(res, 404, true, "Invalid email or password");
    }

    // Check if password matches
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return responseHandler(res, 401, true, "Invalid email or password");
=======
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
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
    }
    logger.info({ code: "checked_record", user: user });
    const { token, refreshToken } = await handleToken(
      res,
      user.id,
      user.email,
      user.username,
      user.role
    );

<<<<<<< HEAD:src/app/controllers/auth/auth.js
    return responseHandler(res, 201, false, "Login Successfully", {
=======
    return responseHandler(req, res, 200, true, "Login Successfully", {
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
      token,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
    });
  } catch (error) {
<<<<<<< HEAD:src/app/controllers/auth/auth.js
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(res, 404, true, "Invalid email or password");
      case "JWTGeneratorError":
        return responseHandler(res, 500, true, "Error creating token");
      case "DatabaseQueryError":
        return responseHandler(res, 500, true, "Internal Server Error");
      default:
        console.error("Error in login process:", error);
        return responseHandler(res, 500, true, "Internal Server Error");
    }
=======
    handleAddError(req, res, error);
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
<<<<<<< HEAD:src/app/controllers/auth/auth.js
      return responseHandler(res, 403, true, "Invalid refresh token");
=======
      return responseHandler(req, res, 403, false, "Invalid refresh token");
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
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

<<<<<<< HEAD:src/app/controllers/auth/auth.js
    return responseHandler(res, 200, false, "New token generated successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(res, 401, true, "Invalid authentication token");
      case "JWTVerificationError":
        const isExpiredError = error instanceof jwt.TokenExpiredError;
        return responseHandler(
          res,
          isExpiredError ? 403 : 401,
          true,
          isExpiredError ? "Token has expired" : "Invalid authentication token"
        );
      case "DatabaseQueryError":
        return responseHandler(res, 500, true, "Internal Server Error");
      default:
        console.error("Error creating a new record:", error);
        return responseHandler(res, 500, true, "Internal Server Error");
    }
=======
    return responseHandler(req, res, 200, true, "New token generated successfully", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    handleRefreshTokenErrors(req, res, error);
>>>>>>> api-key-4:src/app/controllers/v1/auth/auth.js
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
