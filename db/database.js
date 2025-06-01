// 📁 db/database.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./ruxshona.db");

// 🧁 Mahsulotlar

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price INTEGER,
    image TEXT,
    description TEXT,
    unit TEXT
  )
`);

// 🏪 Filial sotuvlari

db.run(`
  CREATE TABLE IF NOT EXISTS branch_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT NOT NULL,
    price INTEGER NOT NULL,
    date TEXT NOT NULL
  )
`);

// 📦 Omborxona

db.run(`
  CREATE TABLE IF NOT EXISTS warehouse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity REAL,
    unit TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// 👤 Foydalanuvchilar
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

module.exports = db;
