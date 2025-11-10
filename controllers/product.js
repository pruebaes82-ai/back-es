import { db } from '../database.js';
import validations from '../validations/schema.js';

export const createProduct = async (req, res) => {
    const { name, description, stock, price, image_url } = req.body;
    const publisherId = req.user ? req.user.id : null;

    const result = validations.createProductSchema.safeParse({ name, description, stock, price, image_url });
    if (!result.success)
        return res.status(400).json({ error: result.error.errors.map(e => e.message).join('. ') });

    try {
        const dbResult = await db.query(
            'INSERT INTO products (name, description, stock, price, image_url, publisher_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, description, stock, price, image_url, publisherId]
        );

        res.json({
            message: `Producto creado: ${name}`,
            product: { id: dbResult.rows[0].id, name, description, stock, price, image_url, publisher_id: publisherId }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

