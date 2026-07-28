const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const productsService = require('./src/services/productsService');
const cartService = require('./src/services/cartService');

// Rutas
const productRoutes = require('./src/routes/productRoute');
const cartRoutes = require('./src/routes/cartRoute');
const productsApiRoutes = require('./src/routes/api/productsApiRoute');
const categoriesApiRoutes = require('./src/routes/api/categoriesApiRoute');
const statsApiRoutes = require('./src/routes/api/statsApiRoute');

// 1. Configuración del Motor de Plantillas (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// 2. Carpeta de archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use('/controllers', express.static(path.join(__dirname, 'src', 'controllers')));

// 3. Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'mi-secreto-ecommerce',
    resave: false,
    saveUninitialized: true
}));

// Middleware para inicializar el carrito en la sesión y pasar datos a todas las vistas
app.use((req, res, next) => {
    cartService.initializeCart(req.session);
    
    res.locals.cartCount = cartService.calculateItemCount(req.session);
    res.locals.cartTotal = cartService.calculateTotal(req.session);

    next();
});

// 4. RUTAS DEFINIDAS
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/api/products', productsApiRoutes);
app.use('/api/categories', categoriesApiRoutes);
app.use('/api/stats', statsApiRoutes);

// Inicio
app.get('/', (req, res) => {
    const { recommended, mostRequested } = productsService.getProductsForHome();
    res.render('index', { products: recommended, mostRequested });
});

// Categorías
app.get('/categories/:category', (req, res) => {
    const categoryParam = req.params.category;
    const db = require('./db/database');
    
    // Buscar la categoría con su nombre original acentuado si existe
    const categories = db.prepare('SELECT name FROM categories').all();
    const normalizeString = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';
    const target = normalizeString(categoryParam);
    const foundCategory = categories.find(c => normalizeString(c.name) === target);
    
    const categoryName = foundCategory ? foundCategory.name : categoryParam;
    const products = productsService.getProductsByCategory(categoryParam);
    res.render('category', { categoryName, products });
});

// Búsqueda
app.get('/search', (req, res) => {
    const query = req.query.query || '';
    const products = productsService.searchByName(query);
    // Reutilizamos la vista de categoría para mostrar resultados de búsqueda
    res.render('category', { categoryName: `Resultados para "${query}"`, products, isSearch: true, searchQuery: query });
});

// Proceso de Pago
app.get('/checkout', (req, res) => {
    res.render('checkout');
});

// Registro de Usuario
app.get('/register', (req, res) => {
    res.render('register', { layout: false });
});

// Inicio de Sesión
app.get('/login', (req, res) => {
    res.render('login', { layout: false });
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