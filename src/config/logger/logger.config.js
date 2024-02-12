const pino = require("pino");
const pretty = require("pino-pretty");

// Configure pino-pretty
const prettyStream = pretty({
  colorize: true, // Colorize log output
  translateTime: true, // Translate timestamps to readable format
  ignore: "pid,hostname", // Ignore certain fields in the output
});

// Create a Pino logger instance
const logger = pino(
  {
    level: process.env.LOG_LEVEL || "info", // Set log level from environment or default to 'info'
  },
  prettyStream
);

module.exports = { logger };
