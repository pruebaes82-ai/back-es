import { db } from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validations from '../validations/schema.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    const result = validations.registerSchema.safeParse({ name, email, password });
    if (!result.success) return res.status(400).json({ error: result.error.errors.map(e => e.message).join('. ') });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) return res.status(400).json({ error: 'Este email ya está en uso' });

        const dbResult = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
            [name, email, hashedPassword]
        );

        res.json({ mensaje: `Usuario registrado: ${name}`, id: dbResult.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const result = validations.loginSchema.safeParse({ email, password });
    if (!result.success) return res.status(400).json({ error: result.error.errors.map(e => e.message).join('. ') });

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 3600000,
            path: '/'
        });

        res.json({ mensaje: `Bienvenido ${user.name}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const isLogged = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No se ha proporcionado un token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
        res.json({ user: decoded });
    });
};
