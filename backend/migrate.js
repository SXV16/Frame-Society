require('dotenv').config();
const db = require('./db.js');

async function migrate() {
  try {
    try {
      await db.query(`ALTER TABLE products ADD COLUMN posted_by_name VARCHAR(255) DEFAULT 'Raphael Studio'`);
      console.log('Added posted_by_name column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column posted_by_name already exists.');
      else throw e;
    }

    // New patches for product stock and user profiles
    try {
      await db.query(`ALTER TABLE products ADD COLUMN stock_count INT DEFAULT 1`);
      console.log('Added stock_count column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column stock_count already exists.');
      else throw e;
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN bio TEXT`);
      console.log('Added bio column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column bio already exists.');
      else throw e;
    }

    try {
      await db.query(`ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(255)`);
      console.log('Added profile_picture_url column.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('Column profile_picture_url already exists.');
      else throw e;
    }

    const [categories] = await db.query(`SELECT * FROM categories`);
    console.log('Categories:', categories);

    const artMap = {
      'Anime': { title: "Katsuhiro Otomo's Akira Original Cel Frame", price: 25000, user: 'Miyazaki Collector' },
      'Cinema': { title: "2001: A Space Odyssey Original Concept Frame", price: 15000, user: 'Kubrick_Vault' },
      'Gaming': { title: "Yoshitaka Amano's Final Fantasy VI Watercolor Frame", price: 55000, user: 'Hironobu_Retro' },
      'Adults': { title: "H.R. Giger Original Biomechanical Frame", price: 45000, user: 'Giger_Estate' },
      'Comics': { title: "Action Comics #1 Original Cover Proof", price: 3200000, user: 'Krypton_Vault' },
      'Photography': { title: "Ansel Adams Moonrise Hernandez Original Print", price: 85000, user: 'f64_Club' },
    };

    const fallbacks = [
      { title: "The Last Supper Restoration Print Frame", price: 500000, user: 'DaVinci_Code' },
      { title: "Van Gogh Starry Night Replica Frame", price: 12000, user: 'Artisan_Guild' },
      { title: "Picasso Guernica Abstract Frame", price: 34000, user: 'Modernist_X' },
      { title: "Banksy Girl with Balloon Limited Edition Frame", price: 85000, user: 'Street_Syndicate' },
      { title: "Mona Lisa High-Res Canvas Frame", price: 100000, user: 'Louvre_Demo' },
    ];

    let fallbackIndex = 0;

    for (const cat of categories) {
      let art = artMap[cat.name];
      if (!art) {
        art = fallbacks[fallbackIndex % fallbacks.length];
        fallbackIndex++;
      }

      const [existingProducts] = await db.query(
        `SELECT id FROM products WHERE title = ? AND category_id = ? LIMIT 1`,
        [art.title, cat.id]
      );

      if (existingProducts.length > 0) {
        console.log(`Skipping existing product for category ${cat.name} (ID: ${cat.id}): ${art.title}`);
        continue;
      }

      console.log(`Inserting for category ${cat.name} (ID: ${cat.id}): ${art.title}`);

      await db.query(`
        INSERT INTO products (title, description, price, category_id, stock_status, tags, posted_by_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [art.title, `An extraordinarily iconic piece curated exclusively for the ${cat.name} collection.`, art.price, cat.id, 1, null, art.user]);
    }

    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
