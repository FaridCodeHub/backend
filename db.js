const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ecoroute",
  password: "farid", //Replace with yur POSTGRES PASSWORD
  port: 5432,
});

module.exports = pool;