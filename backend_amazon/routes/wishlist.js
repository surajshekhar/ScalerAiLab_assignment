const express = require('express');
const router = express.Router();
const db = require('../db');

// Get wishlist items for a user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query(
      `SELECT wi.*, p.name, p.price, p.image_url, p.stock, c.name as category_name
       FROM wishlist_items wi
       JOIN wishlists w ON wi.wishlist_id = w.id
       JOIN products p ON wi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE w.user_id = $1
       ORDER BY wi.id DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to wishlist
router.post('/add', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    // Get or create wishlist for user
    let wishlistResult = await db.query(
      'SELECT id FROM wishlists WHERE user_id = $1',
      [user_id]
    );

    let wishlist_id;
    if (wishlistResult.rows.length === 0) {
      const newWishlist = await db.query(
        'INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id',
        [user_id]
      );
      wishlist_id = newWishlist.rows[0].id;
    } else {
      wishlist_id = wishlistResult.rows[0].id;
    }

    // Check if item already exists in wishlist
    const existingItem = await db.query(
      'SELECT * FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2',
      [wishlist_id, product_id]
    );

    if (existingItem.rows.length > 0) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    // Insert new item
    await db.query(
      'INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)',
      [wishlist_id, product_id]
    );

    res.json({ message: 'Item added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from wishlist
router.delete('/:wishlist_item_id', async (req, res) => {
  try {
    const { wishlist_item_id } = req.params;
    await db.query('DELETE FROM wishlist_items WHERE id = $1', [wishlist_item_id]);
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move item from wishlist to cart
router.post('/move-to-cart', async (req, res) => {
  try {
    const { user_id, product_id, wishlist_item_id } = req.body;

    // Get or create cart
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

    // Add to cart
    const existingCartItem = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cart_id, product_id]
    );

    if (existingCartItem.rows.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 AND product_id = $2',
        [cart_id, product_id]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, 1)',
        [cart_id, product_id]
      );
    }

    // Remove from wishlist
    await db.query('DELETE FROM wishlist_items WHERE id = $1', [wishlist_item_id]);

    res.json({ message: 'Item moved to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
