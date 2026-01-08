const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: log successful connection
pool.on('connect', () => {
  console.log('Connected to Supabase PostgreSQL');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
