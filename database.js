import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://easyshop_uzt6_user:07b1t01X3dIX6YT9RVVK5LFY7qVR4grD@dpg-d4srtsl6ubrc73a7cas0-a/easyshop_uzt6',
    ssl: {
        rejectUnauthorized: false
    }
});

async function initDatabase() {
    try {
        // Crear tablas si no existen
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                money DECIMAL DEFAULT 1000
            );

            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                stock INTEGER NOT NULL,
                price DECIMAL NOT NULL,
                image_url TEXT,
                publisher_id INTEGER REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tablas creadas exitosamente.");
    } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
        throw error;
    }
}

// Inicializar la base de datos
await initDatabase();

export { pool as db };


