const express = require('express');
const path = require('path');
const app = express();

// 1. Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Carpeta de archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// 3. RUTAS DEFINIDAS (User Story #2)

// Inicio
app.get('/', (req, res) => {
    res.render('pages/index');
});

// Listado de Productos
app.get('/products', (req, res) => {
    res.render('pages/product');
});

// Carrito de compras
app.get('/cart', (req, res) => {
    res.render('pages/cart');
});

// Proceso de Pago
app.get('/checkout', (req, res) => {
    res.render('pages/checkout');
});

// Registro de Usuario
app.get('/register', (req, res) => {
    res.render('pages/register');
});

// Inicio de Sesión
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// 4. Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} 🚀`);
});