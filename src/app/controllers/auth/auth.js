// project external files
const bcrypt = require("bcryptjs");

// project files
const { hashPassword } = require("../../../lib/common/bcrypt");
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

// TODO: include role for registration, login, forgotPassword, change password, reset password, verify code
// TODO: make the verification code api for both forgot and email verification after registration

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Check if user already registered
    const userExists = await recordExists("users", [
      { field: "email", operator: "=", value: email },
    ]);

    if (userExists) {
      return responseHandler(res, 409, false, "User already exists");
    } else {
      const hashedPassword = await hashPassword(password);

      const data = {
        full_name: full_name,
        email: email,
        password: hashedPassword,
      };

      createOne(req, res, {
        tableName: "users",
        data: data,
        returnFields: "*",
        excludeFields: ["password"],
      });
    }
  } catch (error) {
    switch (error.message) {
      case "DatabaseQueryError":
        return responseHandler(res, 500, false, "Database query error");
      default:
        console.error("Registration Error:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const isAdmin = role === "admin" ? role : "user";

    // Find user by email
    const user = await checkRecord("users", [
      { field: "email", operator: "=", value: email },
      { field: "role", operator: "=", value: isAdmin },
    ]);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return responseHandler(res, 401, false, "Invalid email or password");
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, username: user.username };
    const token = generateToken(payload);

    // Generate refresh token
    const refreshPayload = { id: user.id };
    const refreshToken = generateToken(refreshPayload, "180d");

    return responseHandler(res, 201, true, "Login Successfully", {
      token,
      refreshToken,
    });
  } catch (error) {
    switch (error.message) {
      case "RecordNotFound":
        return responseHandler(res, 404, false, "Invalid email or password");
      case "JWTGeneratorError":
        return responseHandler(res, 500, false, "Error creating token");
      default:
        console.error("Error creating a new record:", error);
        return responseHandler(res, 500, false, "Internal Server Error");
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
      console.log(email);
      console.log("Updating User Data:", updatedUserData);
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
    
  } catch (error) {
    
  }
}
