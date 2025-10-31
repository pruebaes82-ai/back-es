import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { promises as fs } from 'fs';
import path from 'path';

let db = null;

async function initDatabase() {
    if (!db) {
        // Ensure the database directory exists
        const dbPath = path.resolve('./database.sqlite');
        
        try {
            // If database file exists but is corrupted, delete it
            await fs.access(dbPath).catch(() => {});
            
            db = await open({
                filename: dbPath,
                driver: sqlite3.Database,
                mode: sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE
            });
        } catch (error) {
            console.error('Error opening database:', error);
            throw error;
        }

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

        console.log("Tablas creadas exitosamente.");
    }
    return db;
}

// Inicializar la base de datos
await initDatabase().catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
});

export { db };

