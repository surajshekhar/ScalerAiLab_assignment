const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products (with search and category filter)
router.get('/', async (req, res) => {
  try {
    const { search, category_id } = req.query;
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND p.name ILIKE $${params.length}`;
    }

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product by ID (with images)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const productResult = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = $1`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagesResult = await db.query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order`,
      [id]
    );

    const product = productResult.rows[0];
    product.images = imagesResult.rows;

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
