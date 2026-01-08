// Script to seed the database with sample data
require('dotenv').config();
const fs = require('fs');
const pool = require('./db');

async function seedDatabase() {
    try {
        console.log('Reading seed file...');
        const seed = fs.readFileSync('./seed.sql', 'utf8');

        console.log('Executing seed data...');
        await pool.query(seed);

        console.log('✓ Database seeded successfully!');

        // Verify data was inserted
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        const categoryCount = await pool.query('SELECT COUNT(*) FROM categories');
        const productCount = await pool.query('SELECT COUNT(*) FROM products');

        console.log('\nData summary:');
        console.log(`  - Users: ${userCount.rows[0].count}`);
        console.log(`  - Categories: ${categoryCount.rows[0].count}`);
        console.log(`  - Products: ${productCount.rows[0].count}`);

        await pool.end();
    } catch (error) {
        console.error('✗ Error seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
