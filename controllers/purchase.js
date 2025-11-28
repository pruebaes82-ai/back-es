import { db } from '../database.js';

export const purchase = async (req, res) => {
    if (!req.user) return res.status(401).json({ mensaje: 'No estás autenticado.' });

    const productId = req.body.productId;

    try {
        const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        const productResult = await db.query('SELECT * FROM products WHERE id = $1', [productId]);

        const user = userResult.rows[0];
        const product = productResult.rows[0];

        if (!user || !product) return res.status(404).json({ error: 'Usuario o producto no encontrado' });
        if (user.money < product.price) return res.status(400).json({ error: 'Fondos insuficientes' });
        if (product.stock <= 0) return res.status(400).json({ error: 'Producto agotado' });

        const client = await db.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE users SET money = money - $1 WHERE id = $2', [product.price, user.id]);
            await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [product.id]);
            await client.query('INSERT INTO purchases (user_id, product_id, quantity) VALUES ($1, $2, $3)', [user.id, product.id, 1]);
            await client.query('COMMIT');

            res.json({ message: 'Compra realizada con éxito' });
        } catch (err) {
            await client.query('ROLLBACK');
            res.status(500).json({ error: err.message });
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

