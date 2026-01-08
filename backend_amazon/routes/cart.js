const express = require('express');
const router = express.Router();
const db = require('../db');

// Get cart items for a user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query(
      `SELECT ci.*, p.name, p.price, p.image_url, p.stock,
              (ci.quantity * p.price) as subtotal
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );

    const items = result.rows;
    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

    res.json({ items, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Get or create cart for user
    let cartResult = await db.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [user_id]
    );

    let cart_id;
    if (cartResult.rows.length === 0) {
      const newCart = await db.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [user_id]
      );
      cart_id = newCart.rows[0].id;
    } else {
      cart_id = cartResult.rows[0].id;
    }

    // Check if item already exists in cart
    const existingItem = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cart_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3',
        [quantity, cart_id, product_id]
      );
    } else {
      // Insert new item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cart_id, product_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { cart_item_id, quantity } = req.body;

    if (quantity <= 0) {
      await db.query('DELETE FROM cart_items WHERE id = $1', [cart_item_id]);
      return res.json({ message: 'Item removed from cart' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, cart_item_id]
    );

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:cart_item_id', async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    await db.query('DELETE FROM cart_items WHERE id = $1', [cart_item_id]);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
