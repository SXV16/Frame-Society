require('dotenv').config();
const mysql = require('mysql2/promise'); // promise version so we can use async/await

// One pool is shared by all routes. It reuses connections instead of opening a new one per request.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raphael_frame_society',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
