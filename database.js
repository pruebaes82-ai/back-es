import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: 'postgresql://easyshop_v44l_user:axLs21immlxVEMATTcWuHvVjHE7vffDV@dpg-d48krapr0fns7383rbdg-a.oregon-postgres.render.com/easyshop_v44l',
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

