import { db } from '../database.js';

export const getUsers = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);
        if (isAdmin.role !== 'admin') return res.status(403).json({ message: 'No tienes permisos.' });

        const rows = req.limit
            ? await db.all('SELECT * FROM users LIMIT ?', req.limit)
            : await db.all('SELECT * FROM users');

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);
        if (isAdmin.role !== 'admin') return res.status(403).json({ message: 'No tienes permisos.' });

        const rows = req.limit
            ? await db.all('SELECT * FROM products LIMIT ?', req.limit)
            : await db.all('SELECT * FROM products');

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPurchases = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);
        if (isAdmin.role !== 'admin') return res.status(403).json({ message: 'No tienes permisos.' });

        const rows = req.limit
            ? await db.all('SELECT * FROM purchases LIMIT ?', req.limit)
            : await db.all('SELECT * FROM purchases');

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const injectSQL = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const isAdmin = await db.get('SELECT role FROM users WHERE id = ?', req.user.id);
        if (isAdmin.role !== 'admin') return res.status(403).json({ message: 'No tienes permisos.' });

        await db.exec(req.body.query);
        res.json({ mensaje: 'Consulta ejecutada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
