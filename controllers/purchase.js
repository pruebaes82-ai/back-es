import { db } from '../database.js';

export const purchase = async (req, res) => {
    if (!req.user) return res.status(401).json({ mensaje: 'No estás autenticado.' });

    const productId = req.body.productId;

    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
        const product = await db.get('SELECT * FROM products WHERE id = ?', productId);

        if (!user || !product) return res.status(404).json({ error: 'Usuario o producto no encontrado' });
        if (user.money < product.price) return res.status(400).json({ error: 'Fondos insuficientes' });
        if (product.stock <= 0) return res.status(400).json({ error: 'Producto agotado' });

        await db.run('BEGIN TRANSACTION');
        try {
            await db.run('UPDATE users SET money = money - ? WHERE id = ?', product.price, user.id);
            await db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', product.id);
            await db.run('INSERT INTO purchases (user_id, product_id, quantity) VALUES (?, ?, ?)', user.id, product.id, 1);
            await db.run('COMMIT');

            res.json({ mensaje: 'Compra realizada con éxito' });
        } catch (err) {
            await db.run('ROLLBACK');
            res.status(500).json({ error: err.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
