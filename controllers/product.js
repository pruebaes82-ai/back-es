const { db } = require('../database.js'); // tu archivo database.js
const validations = require('../validations/schema.js');

// =====================
// CREAR PRODUCTO
// =====================
exports.createProduct = async (req, res) => {

    // Verificar si el usuario tiene token válido
    if (!req.user) {
        return res.status(401).json({ message: 'No estás autenticado. Inicia sesión primero.' });
    }

    const { name, description, stock, price, image_url } = req.body;

    // Validar datos con Zod
    const result = validations.createProductSchema.safeParse({ name, description, stock, price, image_url });
    if (!result.success) {
        return res.status(400).json({
            error: result.error.errors.map(e => e.message).join('. ')
        });
    }

    try {
        const dbResult = await db.run(
            'INSERT INTO products (name, description, stock, price, image_url, publisher_id) VALUES (?, ?, ?, ?, ?, ?)',
            name, description, stock, price, image_url, req.user.id
        );

        res.json({
            message: `Producto creado: ${name}`,
            product: {
                id: dbResult.lastID,
                name,
                description,
                stock,
                price,
                image_url,
                publisher_id: req.user.id
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto', details: error.message });
    }
};
}
