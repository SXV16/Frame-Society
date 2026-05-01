const db = require('./backend/db');
async function run() {
  await db.query("INSERT IGNORE INTO categories (name) VALUES ('Cinema'), ('Gaming')");
  const [rows] = await db.query("SELECT * FROM categories WHERE name IN ('Cinema', 'Gaming')");
  console.log(rows);
  process.exit(0);
}
run();
