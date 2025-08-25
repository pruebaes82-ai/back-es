const express = require('express');
//const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const controllers = require('./controllers');
const jwt = require('jsonwebtoken');


const app = express();

//app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos desde la carpeta "public"


// habilitar cors a github pages 
app.use(cors({
    origin: 'https://erikdaniel949.github.io',
    credentials: true, // Permitir cookies
}));


app.use(express.json()); // Middleware para parsear JSON
app.use(cookieParser()); // Middleware para parsear cookies

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// Middleware para verificar el token en cada solicitud
app.use((req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        req.user = null; // No hay token, usuario no autenticado
        return next();  // Sigue con el routeo
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        
        req.user = decoded;
        next(); // Sigue con el routeo
    });
});


app.post('/register', controllers.register);

app.post('/login', controllers.login);

app.get('/isLogged', controllers.isLogged);

app.post('/createProduct', controllers.createProduct);

app.post('/purchase', controllers.purchase);

app.get('/showDatabase', controllers.showDatabase);

app.post('/injectSQL', controllers.injectSQL);
