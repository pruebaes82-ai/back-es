const pool = require('../database');


exports.purchase = async (req, res) => {
    try {
        // Verificar si el usuario tiene un token válido
        if (!req.user) {
            return res.status(401).json({ mensaje: 'No estás autenticado. Inicia sesión primero.' });
        }
        
        // Obtener el dinero del usuario y el precio del producto
        const userRequest = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const productRequest = await pool.query('SELECT * FROM products WHERE id = ?', [req.body.productId]);

        // Verificar si el usuario y el producto existen
        if (userRequest.length === 0 || productRequest.length === 0) {
            return res.status(404).json({ error: 'Usuario o producto no encontrado' });
        }

        const user = userRequest[0][0];
        const product = productRequest[0][0];

        // Verificar si el usuario tiene fondos suficientes y si el producto tiene stock disponible
        if (user.money < product.price) {
            return res.status(400).json({ error: 'Fondos insuficientes' });
        }

        if (product.stock <= 0) {
            return res.status(400).json({ error: 'Producto agotado' });
        }

        // Iniciar una transacción
        await pool.query('START TRANSACTION');

        try {
            // Restar el dinero al usuario
            await pool.query('UPDATE users SET money = money - ? WHERE id = ?', [product.price, user.id]);

            // Restar 1 al stock del producto
            await pool.query('UPDATE products SET stock = stock - 1 WHERE id = ?', [product.id]);

            // Insertar el registro de la compra
            await pool.query('INSERT INTO purchases (user_id, product_id) VALUES (?, ?)', [user.id, product.id]);

            // Confirmar la transacción
            await pool.query('COMMIT');

            // Responder al cliente
            res.json({ mensaje: 'Compra realizada con éxito' });
        } catch (error) {
            // Si ocurre un error, revertir la transacción
            await pool.query('ROLLBACK');
            res.status(500).json({ error: 'Error al procesar la compra', details: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud', details: error.message });
    }
};