const verifyApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-KEY');
    if (!apiKey) {
        return res.status(401).send('API key is required');
    }

    // Here, you should check if the API key is valid
    // For example, by looking it up in your database
    if (apiKey !== 'your-expected-api-key') {
        return res.status(403).send('Invalid API key');
    }

    next();
}


module.exports = {
  verifyApiKey,
};
