const { db } = require('../database.js'); // tu archivo database.js

// =====================
// REALIZAR COMPRA
// =====================
exports.purchase = async (req, res) => {
    try {
        // Verificar si el usuario tiene token válido
        if (!req.user) {
            return res.status(401).json({ mensaje: 'No estás autenticado. Inicia sesión primero.' });
        }

        const productId = req.body.productId;

        // Obtener usuario y producto
        const user = await db.get('SELECT * FROM users WHERE id = ?', req.user.id);
        const product = await db.get('SELECT * FROM products WHERE id = ?', productId);

        if (!user || !product) {
            return res.status(404).json({ error: 'Usuario o producto no encontrado' });
        }

        // Verificar fondos y stock
        if (user.money < product.price) {
            return res.status(400).json({ error: 'Fondos insuficientes' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ error: 'Producto agotado' });
        }

        // Iniciar transacción
        await db.run('BEGIN TRANSACTION');

        try {
            // Restar dinero al usuario
            await db.run('UPDATE users SET money = money - ? WHERE id = ?', product.price, user.id);

            // Restar stock del producto
            await db.run('UPDATE products SET stock = stock - 1 WHERE id = ?', product.id);

            // Insertar registro de compra
            await db.run(
                'INSERT INTO purchases (user_id, product_id, quantity) VALUES (?, ?, ?)',
                user.id, product.id, 1
            );

            // Confirmar transacción
            await db.run('COMMIT');

            res.json({ mensaje: 'Compra realizada con éxito' });
        } catch (error) {
            // Revertir transacción si falla
            await db.run('ROLLBACK');
            res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
};
