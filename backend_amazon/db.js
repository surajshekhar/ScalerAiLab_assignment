// backend_amazon/db.js
const { Pool } = require("pg");

// Use DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL configuration - some Railway databases don't support SSL
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false
});

module.exports = pool;
