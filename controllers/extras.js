import { db } from '../database.js';

export const getUsers = async (req, res) => {
    try {
        /*
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const adminResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (!adminResult.rows[0] || adminResult.rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos.' });
        }
        */

        const result = req.limit
            ? await db.query('SELECT * FROM users LIMIT $1', [req.limit])
            : await db.query('SELECT * FROM users');

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProducts = async (req, res) => {
  try {
    // No authentication required for products
    const result = req.limit
      ? await db.query('SELECT * FROM products LIMIT $1', [req.limit])
      : await db.query('SELECT * FROM products');

    res.json(result.rows);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPurchases = async (req, res) => {
    try {
        /*
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const adminResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (!adminResult.rows[0] || adminResult.rows[0].role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos.' });
        }
        */

        const result = req.limit
            ? await db.query('SELECT * FROM purchases LIMIT $1', [req.limit])
            : await db.query('SELECT * FROM purchases');

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const result = await db.query(
            `SELECT p.name, p.description, p.price, p.image_url
             FROM purchases pu
             JOIN products p ON p.id = pu.product_id
             WHERE pu.user_id = $1`,
            [req.user.id]
        );

        // If you prefer unique products, you can use DISTINCT in the query
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Falta el parámetro id.' });
        }
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const injectSQL = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const adminResult = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (!adminResult.rows[0] || adminResult.rows[0].role !== 'admin') return res.status(403).json({ message: 'No tienes permisos.' });

        await db.query(req.body.query);
        res.json({ mensaje: 'Consulta ejecutada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const increaseBalance = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

        const { amount } = req.body;

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Cantidad inválida.' });
        }
        await db.query('UPDATE users SET money = money + $1 WHERE id = $2', [amount, req.user.id]);
        res.json({ message: 'Balance incrementado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBalance = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });
        
        const result = await db.query('SELECT money FROM users WHERE id = $1', [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        
        res.json({ balance: result.rows[0].money });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};
