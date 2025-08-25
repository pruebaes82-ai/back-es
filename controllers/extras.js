const pool = require('../database');


exports.showDatabase = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
        }

        const isAdmin = await pool.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
       
        if (isAdmin[0][0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para ver la base de datos.' });
        }

        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al mostrar la base de datos', details: error.message });
    }
}

exports.injectSQL = async (req, res) => {
    try {
        pool.query(req.body.query);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
}