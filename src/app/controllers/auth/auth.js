// project external files

// project files
const { hashPassword, verifyPassword } = require("../../../lib/common/bcrypt");
const { createOne } = require("../../../utils/dbUtils/crud/createOne");
const { responseHandler } = require("../../../utils/common/apiResponseHandler");
const { generateToken, verifyToken } = require("../../../lib/common/jwt");
const {
  insertRecord,
  updateRecord,
} = require("../../../utils/dbUtils/helper/dbOperations");
const {
  checkRecord,
  recordExists,
} = require("../../../utils/dbUtils/helper/validationHelper");
const { setCookie } = require("../../../utils/common/cookieHandler");
const {
  ACCESS_TOKEN_EXPIRY_SECONDS,
  MAX_AGE_REFRESH_TOKEN,
  MAX_AGE_ACCESS_TOKEN,
  REFRESH_TOKEN_EXPIRY_DAYS,
} = require("../../../constants/auth");

// TODO: include role for registration, login, forgotPassword, change password, reset password, verify code
// TODO: make the verification code api for both forgot and email verification after registration

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    // Check if user already registered
    const userExists = await recordExists("users", [
      { field: "email", operator: "=", value: email },
    ]);

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
    if (!user) {
      return responseHandler(res, 404, true, "Invalid email or password");
    }

    // Check if password matches
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return responseHandler(res, 401, true, "Invalid email or password");
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

    return responseHandler(res, 201, false, "Login Successfully", {
      token,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
      refreshToken,
    });
  } catch (error) {
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
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return responseHandler(res, 403, true, "Invalid refresh token");
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
