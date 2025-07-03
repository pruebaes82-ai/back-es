const bcrypt = require('bcrypt');
const pool = require('../database');
const validations = require('../validations/schema');



exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validar datos con Zod
    const result = validations.registerSchema.safeParse({ name, email, password });
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors.map(e => e.message).join(', ') });
    }

    try {
        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Este email ya está en uso, pruebe a loguearse' });
        }

        // Insertar usuario en la base de datos
        const [dbResult] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        res.json({ mensaje: `Usuario registrado: ${name}`, id: dbResult.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validar datos con Zod
    const result = validations.loginSchema.safeParse({ email, password });
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors.map(e => e.message).join('. ') });
    }

    try {
        // Buscar usuario por el email
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña inválidos' });
        }

        const user = rows[0];

        // Comparar contraseña recibida con la almacenada mediante bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Usuario o contraseña inválidos' });
        }

        // No enviar la contraseña en la respuesta
        const { password: _, ...userWithoutPassword } = user;

        res.json({ mensaje: `Bienvenido ${user.name}`, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
}

