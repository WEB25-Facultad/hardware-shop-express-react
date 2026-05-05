const express = require('express');
const path = require('path');
const app = express();
const productModel = require('./src/models/productModel');

// Rutas
const productRoutes = require('./src/routes/productRoute');

// 1. Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// 2. Carpeta de archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 3. RUTAS DEFINIDAS
app.use('/products', productRoutes);

// Inicio
app.get('/', (req, res) => {
    const products = productModel.findAll();
    res.render('index', { products });
});

// Carrito de compras
app.get('/cart', (req, res) => {
    res.render('cart');
});

// Proceso de Pago
app.get('/checkout', (req, res) => {
    res.render('checkout');
});

// Registro de Usuario
app.get('/register', (req, res) => {
    res.render('register');
});

// Inicio de Sesión
app.get('/login', (req, res) => {
    res.render('login');
});

// 4. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} 🚀`);
});