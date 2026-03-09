const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function initDB() {
  const client = await pool.connect();

  try {
    console.log("Checking database schema...");

    const schema = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    await client.query("BEGIN");
    await client.query(schema);
    await client.query("COMMIT");

    console.log("Database schema ready");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Schema initialization failed:", err.message);
  } finally {
    client.release();
  }
}

module.exports = initDB;