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
    const allProducts = productModel.findAll();
    
    // "Te puede interesar": 5 productos aleatorios
    const products = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // "Los más pedidos": marcados con un flag y aleatorios (hasta 10)
    const mostRequested = allProducts
        .filter(p => p.mostRequested)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
        
    res.render('index', { products, mostRequested });
});

// Categorías
app.get('/categories/:category', (req, res) => {
    const categoryName = req.params.category;
    const allProducts = productModel.findAll();
    // Filtramos ignorando mayúsculas/minúsculas para ser más robustos
    const products = allProducts.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    res.render('category', { categoryName, products });
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

// 5. Manejo de Error 500 (Debe ir al final de todo)
app.use((err, req, res, next) => {
    console.error('Error interno del servidor:', err.stack);
    res.status(500).render('500');
});

// 4. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} 🚀`);
});