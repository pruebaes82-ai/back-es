import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
});

// Crear tablas si no existen
await db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    money REAL DEFAULT 1000
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    stock INTEGER NOT NULL,
    price REAL NOT NULL,
    image_url TEXT,
    publisher_id INTEGER,
    FOREIGN KEY (publisher_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
`);
