// config env
require("dotenv").config();
// project external files
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// project files
const pool = require("./src/config/db/db.connect");
const initDatabase = require("./src/config/db/db.config");
const apiRouter = require('./src/app/routes/api')
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
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use("/api", apiRouter);

app.listen(PORT, ()=> console.log(`App listening on ${PORT}`));
