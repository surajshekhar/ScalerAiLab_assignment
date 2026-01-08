// Script to initialize the database with schema
require('dotenv').config();
const fs = require('fs');
const pool = require('./db');

async function initDatabase() {
    try {
        console.log('Reading schema file...');
        const schema = fs.readFileSync('./schema.sql', 'utf8');

        console.log('Executing schema...');
        await pool.query(schema);

        console.log('✓ Database schema initialized successfully!');

        // Verify tables were created
        const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log('\nTables created:');
        result.rows.forEach(row => console.log(`  - ${row.table_name}`));

        await pool.end();
    } catch (error) {
        console.error('✗ Error initializing database:', error.message);
        process.exit(1);
    }
}

initDatabase();
