const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders for a user
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query(
      `SELECT o.*, 
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order by ID
router.get('/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await db.query(
      `SELECT oi.*, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order_id]
    );

    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { user_id, shipping_address } = req.body;

    console.log('Creating order for user_id:', user_id);
    console.log('Shipping address:', shipping_address);

    // Validate input
    if (!user_id || !shipping_address) {
      return res.status(400).json({ error: 'Missing user_id or shipping_address' });
    }

    // Get cart items
    const cartResult = await db.query(
      `SELECT ci.*, p.price, p.stock
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id]
    );

    console.log('Cart items found:', cartResult.rows.length);

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const cartItems = cartResult.rows;
    
    // Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock. Available: ${item.stock}` 
        });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    console.log('Order total:', total);

    // Create order
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [user_id, total, shipping_address]
    );

    const order = orderResult.rows[0];
    console.log('Order created with id:', order.id);

    // Create order items and update stock
    for (const item of cartItems) {
      console.log(`Adding order item - product_id: ${item.product_id}, qty: ${item.quantity}`);
      
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, parseFloat(item.price)]
      );

      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.query(
      'DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)',
      [user_id]
    );

    console.log('Order completed successfully');
    res.status(201).json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
