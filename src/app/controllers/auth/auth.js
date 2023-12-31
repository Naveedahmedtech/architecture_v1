// project external files
const bcrypt = require("bcryptjs");

// project files
const { hashPassword } = require("../../../lib/common/bcrypt");
const { createOne } = require("../../../utils/dbUtils/crud/createOne");
const checkRecord = require("../../../utils/dbUtils/helper/validationHelper");
const { responseHandler } = require("../../../utils/common/apiResponseHandler");
const { generateToken, verifyToken } = require("../../../lib/common/jwt");

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

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
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await checkRecord("users", "email", email);

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
        return responseHandler(res, 404, false, "Record not found");
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
    const user = await checkRecord("users", "id", decoded.id);

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
        return responseHandler(res, 404, false, "Record not found");
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
    const { email, name, provider, providerId } = req.body; // provider can be 'google', 'facebook', etc.

    // Check if the user exists
    let user = await checkRecord("users", "email", email);

    if (!user) {
      // User does not exist, create a new user
      const newUser = {
        email,
        name,
        provider,
        providerId, // Unique identifier from the social platform
        // Other fields as required
      };
      // Insert newUser into the database
      // ...
      user = newUser; // Assign the new user for token generation
    } else {
      // User exists, optionally update user details
      // ...
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email, username: user.username };
    const token = generateToken(payload);

    // Generate refresh token
    const refreshPayload = { id: user.id };
    const refreshToken = generateToken(refreshPayload, "180d");

    return responseHandler(res, 201, true, "Login successful", {
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Social login error:", error);
    return responseHandler(res, 500, false, "Internal Server Error");
  }
};
