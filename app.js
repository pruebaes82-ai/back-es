const express = require('express');
//const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const controllers = require('./controllers/controller');


const app = express();

//app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos desde la carpeta "public"


// habilitar cors a github pages 
app.use(cors({
    origin: 'https://erikdaniel949.github.io',
    credentials: true, // Permitir cookies
}));


app.use(express.json()); // Middleware para parsear JSON
app.use(cookieParser()); // Middleware para parsear cookies
// Backend (Express con cors)

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/showDatabase', controllers.showDatabase);

app.get('/isLogged', controllers.isLogged);

app.post('/register', controllers.register);

app.post('/login', controllers.login);

app.POST('/purchase', controllers.purchase);
