const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const productModel = require('./src/models/productModel');

// Rutas
const productRoutes = require('./src/routes/productRoute');
const cartRoutes = require('./src/routes/cartRoute');

// 1. Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// 2. Carpeta de archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/controllers', express.static(path.join(__dirname, 'src', 'controllers')));

// 3. Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'mi-secreto-ecommerce',
    resave: false,
    saveUninitialized: true
}));

// Middleware para inicializar el carrito en la sesión si no existe y pasar datos a todas las vistas
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    // Calculamos la cantidad total de productos (suma de quantities)
    res.locals.cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    
    // Calculamos el precio total general
    res.locals.cartTotal = req.session.cart.reduce((total, item) => {
        const product = productModel.findById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    next();
});

// 4. RUTAS DEFINIDAS
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Inicio
app.get('/', (req, res) => {
    const products = productModel.findAll();
    res.render('index', { products });
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

// 4. Manejo de Error 404 (Debe ir después de todas las rutas)
app.use((req, res) => {
    res.status(404).render('404');
});

// 4. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} 🚀`);
});