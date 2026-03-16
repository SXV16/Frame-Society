const express = require('express');
const bcrypt = require('bcrypt');   // hash passwords so we never store plain text
const jwt = require('jsonwebtoken'); // create a token the frontend sends back on each request
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');
const router = express.Router();

const SALT_ROUNDS = 10; // higher = more secure but slower

// Register: hash password, save user, return token + user so frontend can log them in
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const r = role === 'admin' ? 'admin' : 'buyer';
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, name || null, password_hash, r]
    );
    const user = { id: result.insertId, email, name: name || null, role: r };
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

// Login: find user by email, check password with bcrypt, return token + user
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const [rows] = await db.query(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const u = rows[0];
    const ok = await bcrypt.compare(password, u.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
    const user = { id: u.id, email: u.email, name: u.name, role: u.role };
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
