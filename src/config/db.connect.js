const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  max: process.env.MAX,
});

pool.on("error", (err) => {
  console.error("Unexpected Error on idle client", err);
});

module.exports = pool;
