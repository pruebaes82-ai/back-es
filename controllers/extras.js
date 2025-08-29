const pool = require('../database');


exports.getUsers = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);

        if (isAdmin[0][0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        // obtener solo la cantidad de registros que se pida
        if (req.limit) {
            const [rows] = await pool.query('SELECT * FROM users LIMIT ?', [parseInt(req.limit)]);
            return res.json(rows);
        }

        // si no se especifica devuelve todos
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
}

exports.getProducts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);

        if (isAdmin[0][0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        // obtener solo la cantidad de registros que se pida
        if (req.limit) {
            const [rows] = await pool.query('SELECT * FROM products LIMIT ?', [parseInt(req.limit)]);
            return res.json(rows);
        }

        // si no se especifica devuelve todos
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
}

exports.getPurchases = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);

        if (isAdmin[0][0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        // obtener solo la cantidad de registros que se pida
        if (req.limit) {
            const [rows] = await pool.query('SELECT * FROM purchases LIMIT ?', [parseInt(req.limit)]);
            return res.json(rows);
        }

        // si no se especifica devuelve todos
        const [rows] = await pool.query('SELECT * FROM purchases');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
}

exports.injectSQL = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);

        if (isAdmin[0][0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        pool.query(req.body.query);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
}
