import express from 'express';
// import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as controllers from './controllers/index.js';
import jwt from 'jsonwebtoken';

const app = express();

// app.use(express.static(path.join(process.cwd(), "public"))); // Servir archivos estáticos desde "public"

// Habilitar CORS a GitHub Pages
app.use(cors({
    origin: 'https://erikdaniel949.github.io',
    credentials: true,
}));

app.use(express.json()); // Middleware para parsear JSON
app.use(cookieParser()); // Middleware para parsear cookies

// Middleware para verificar el token en cada solicitud
app.use((req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        req.user = null; // No hay token, usuario no autenticado
        return next();  // Sigue con el routeo
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
});

// Rutas
app.post('/register', controllers.register);
app.post('/login', controllers.login);
app.get('/isLogged', controllers.isLogged);

app.post('/createProduct', controllers.createProduct);
app.post('/purchase', controllers.purchase);
app.patch('/increaseBalance', controllers.increaseBalance);
app.get('/getBalance', controllers.getBalance);

app.get('/getUsers', controllers.getUsers);
app.get('/getProducts', controllers.getProducts);
app.get('/getPurchases', controllers.getPurchases);
app.get('/getProductById/:id', controllers.getProductById);
app.get('/getMyProducts', controllers.getMyProducts);

app.post('/injectSQL', controllers.injectSQL);

// Iniciar servidor
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


