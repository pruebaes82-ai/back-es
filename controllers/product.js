import { db } from '../database.js';
import validations from '../validations/schema.js';

export const createProduct = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'No estás autenticado.' });

    const { name, description, stock, price, image_url } = req.body;

    const result = validations.createProductSchema.safeParse({ name, description, stock, price, image_url });
    if (!result.success) return res.status(400).json({ error: result.error.errors.map(e => e.message).join('. ') });

    try {
        const dbResult = await db.run(
            'INSERT INTO products (name, description, stock, price, image_url, publisher_id) VALUES (?, ?, ?, ?, ?, ?)',
            name, description, stock, price, image_url, req.user.id
        );

        res.json({
            message: `Producto creado: ${name}`,
            product: { id: dbResult.lastID, name, description, stock, price, image_url, publisher_id: req.user.id }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
