/**
 * Sets a cookie on the response object.
 * @param {Object} res - The response object from Express.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} maxAge - The max age of the cookie in milliseconds.
 * @param {boolean} isSecure - Flag to set the cookie only on HTTPS.
 */
const setCookie = (res, name, value, maxAge, isSecure = true) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: "Strict",
    maxAge: maxAge,
  };

  res.cookie(name, value, cookieOptions);
}


module.exports = {
    setCookie
}
