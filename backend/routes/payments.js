const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/payments body: { "order_id", "amount", "demo_last4?", "demo_brand?" } -> 201 { "success", "transaction_id", "message" }
router.post('/payments', async (req, res) => {
  try {
    const { order_id, amount, demo_last4, demo_brand } = req.body;
    if (!order_id || amount == null) {
      return res.status(400).json({ error: 'order_id and amount are required' });
    }

    const [orderRows] = await db.query(
      'SELECT id, total, status, session_id FROM orders WHERE id = ?',
      [order_id]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const transaction_id =
      'demo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

    await db.query(
      'INSERT INTO payments (order_id, amount, status, demo_last4, demo_brand, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        order_id,
        parseFloat(amount),
        'completed',
        demo_last4 || '4242',
        demo_brand || 'demo',
        transaction_id,
      ]
    );

    // Update order status
    await db.query("UPDATE orders SET status = 'paid' WHERE id = ?", [order_id]);

    // Decrement stock count
    const session_id = orderRows[0].session_id;
    if (session_id) {
       const [cartRows] = await db.query('SELECT product_id, quantity FROM cart_items WHERE session_id = ?', [session_id]);
       for(const item of cartRows) {
         await db.query('UPDATE products SET stock_count = GREATEST(0, stock_count - ?) WHERE id = ?', [item.quantity, item.product_id]);
       }
    }

    res.status(201).json({
      success: true,
      transaction_id,
      message: 'Payment completed (demo). No real charge made.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/payments/order/:order_id -> [{ "id", "order_id", "amount", "status", "transaction_id", "created_at" }]
router.get('/payments/order/:order_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, order_id, amount, status, demo_last4, demo_brand, transaction_id, created_at FROM payments WHERE order_id = ?',
      [req.params.order_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
