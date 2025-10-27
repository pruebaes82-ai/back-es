import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

// Activar claves foráneas
await db.exec(`PRAGMA foreign_keys = ON;`);

// Crear tablas si no existen
await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  money REAL NOT NULL DEFAULT 1000,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL,
  image_url TEXT,
  publisher_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publisher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total REAL GENERATED ALWAYS AS (
    (SELECT price FROM products WHERE products.id = product_id) * quantity
  ) STORED,
  purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
`);

// Insertar usuario admin si no existe
await db.exec(`
INSERT INTO users (name, email, password, role, money)
SELECT 'Administrador', 'admin@mail.com', '1234', 'admin', 5000
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@mail.com');
`);
