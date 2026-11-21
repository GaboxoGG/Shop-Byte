
require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Conexión a PostgreSQL establecida.");
});

pool.on("error", (error) => {
  console.error("Error inesperado en PostgreSQL:", error);
});

module.exports = pool;
