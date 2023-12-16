// config env
require("dotenv").config();
// project external files
const express = require("express");
const path = require("path");

// project files
const customersController = require("./src/app/controllers/orders/orders");
const pool = require("./src/config/db.connect");
const initDatabase = require("./src/config/db.config");

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

app.get("/allOrders", customersController.getDetailedOrders);
app.get("/getAllOrders", customersController.getAllOrders);


app.listen(PORT, ()=> console.log(`App listening on ${PORT}`));
