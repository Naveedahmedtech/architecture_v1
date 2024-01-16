const responseHandler = (res, status, success, message, result = null) => {
  const response = {
    code: status,
    error: success,
    detail: message,
  };

  if (result) response.result = result;

  return res.status(status).json(response);
};


module.exports = {
    responseHandler
}
