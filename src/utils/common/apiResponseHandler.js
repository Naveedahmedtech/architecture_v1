const responseHandler = (res, status, success, message, result = null) => {
  const response = {
    status: success,
    message: message,
  };

  if (result) response.result = result;

  return res.status(status).json(response);
};


module.exports = {
    responseHandler
}
