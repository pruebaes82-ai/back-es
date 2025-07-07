const express = require('express');
const cors = require('cors');
const controllers = require('./controllers/controllers');

const app = express();
app.use(cors()); // Middleware para habilitar CORS
app.use(express.json()); // Middleware para parsear JSON

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/showDatabase', controllers.showDatabase);

app.post('/register', controllers.register);

app.post('/login', controllers.login);