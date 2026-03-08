require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"  //Prevent SSL Error while running Locally
    ? { rejectUnauthorized: false }
    : false
});

module.exports = pool;