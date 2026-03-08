const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
console.log(process.env.DATABASE_URL);
async function initDB() {
  try {
    const schemaSql = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    console.log("Initializing database schema...");
    await pool.query(schemaSql);
    console.log("Schema initialized successfully!");
  } catch (error) {
    console.error("Error initializing database schema:", error);
  } finally {
    await pool.end();
  }
}

initDB();