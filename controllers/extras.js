import { db } from '../database.js';  // tu archivo database.js con SQLite

export const getUsers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);

        if (isAdmin.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        // Obtener solo la cantidad de registros que se pida
        let rows;
        if (req.limit) {
            rows = await db.all('SELECT * FROM users LIMIT ?', req.limit);
        } else {
            rows = await db.all('SELECT * FROM users');
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);

        if (isAdmin.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        let rows;
        if (req.limit) {
            rows = await db.all('SELECT * FROM products LIMIT ?', req.limit);
        } else {
            rows = await db.all('SELECT * FROM products');
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
};

export const getPurchases = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);

        if (isAdmin.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        let rows;
        if (req.limit) {
            rows = await db.all('SELECT * FROM purchases LIMIT ?', req.limit);
        } else {
            rows = await db.all('SELECT * FROM purchases');
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
};

export const injectSQL = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);

        if (isAdmin.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        // Ejecutar consulta arbitraria
        await db.exec(req.body.query);

        res.json({ mensaje: 'Consulta ejecutada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
};
