// backend_amazon/db.js
const { Pool } = require("pg");

// Use DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Railway
  }
});

module.exports = pool;
