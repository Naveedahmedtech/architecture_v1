// config env
require("dotenv").config();
// project external files
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const { logger } = require("./src/config/logger/logger.config");
const expressPino = require("express-pino-logger")({
  logger,
});

// project files
const pool = require("./src/config/db/db.connect");
const initDatabase = require("./src/config/db/db.config");
const apiRouter = require("./src/app/routes/v1/api");
const { responseHandler } = require("./src/utils/common/apiResponseHandler");

// Connect to the database
pool.connect((err, client, release) => {
  if (err) {
    console.error("Could not connect to PostgreSQL server:", err);
  } else {
    console.log("Connected to database successfully");
    client.release();
    initDatabase();
  }
});

const app = express();

const PORT = process.env.APP_PORT || 3025;

app.use(express.json());

app.use("public", express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1", apiRouter);


// http req logging
app.use(expressPino);

app.use("*", (req, res) => {
  return responseHandler(req, res, 404, false, "Request Not Found");
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.listen(PORT, () => logger.info(`App listening on ${PORT}`));
