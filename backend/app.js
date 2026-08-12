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
const usersApiRoutes = require('./src/routes/api/usersApiRoute');

// 1. Configuración del Motor de Plantillas (EJS)
// EXPLICACIÓN: Aquí configuramos EJS. Esto permite que el backend arme el HTML de la tienda pública 
// (el catálogo, el carrito) inyectando datos directamente antes de enviarlo al navegador del cliente.
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
// EXPLICACIÓN: Utilizamos este middleware de sesión. Antes de que cualquier ruta responda, este bloque 
// revisa si el usuario tiene un carrito activo. Al guardarlo en `res.locals`, el contador del carrito 
// y los datos del usuario logueado están disponibles globalmente en cualquier pantalla de la tienda.
app.use((req, res, next) => {
    cartService.initializeCart(req.session);
    
    res.locals.cartCount = cartService.calculateItemCount(req.session);
    res.locals.cartTotal = cartService.calculateTotal(req.session);
    res.locals.user = req.session.user || null;

    next();
});

// 4. RUTAS DEFINIDAS
// EXPLICACIÓN: Las rutas de la tienda normal (EJS) están arriba.
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
// EXPLICACIÓN: Estas rutas de la API (/api/...) son distintas. Devuelven respuestas en formato JSON puro. 
// Están diseñadas exclusivamente para que nuestro Panel de Administración en React las consuma y gestione la información.
app.use('/api/products', productsApiRoutes);
app.use('/api/categories', categoriesApiRoutes);
app.use('/api/stats', statsApiRoutes);
app.use('/api/users', usersApiRoutes);

// Inicio
app.get('/', (req, res) => {
    const { recommended, mostRequested } = productsService.getProductsForHome();
    res.render('pages/index', { products: recommended, mostRequested });
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
    res.render('pages/category', { categoryName, products });
});

// Búsqueda
app.get('/search', (req, res) => {
    const query = req.query.query || '';
    const products = productsService.searchByName(query);
    // Reutilizamos la vista de categoría para mostrar resultados de búsqueda
    res.render('pages/category', { categoryName: `Resultados para "${query}"`, products, isSearch: true, searchQuery: query });
});

// Proceso de Pago
app.get('/checkout', (req, res) => {
    res.render('pages/checkout');
});

// Dependencias para registro y login
const crypto = require('crypto');
const db = require('./db/database');

// Registro de Usuario
app.get('/register', (req, res) => {
    res.render('pages/register', { layout: false, error: null });
});

app.post('/register', (req, res) => {
    const { nombre, apellido, email, password, password_repeat } = req.body;
    
    // Validaciones en el servidor
    if (!nombre || !apellido || !email || !password || !password_repeat) {
        return res.render('pages/register', { layout: false, error: 'Todos los campos son obligatorios.' });
    }
    
    if (password !== password_repeat) {
        return res.render('pages/register', { layout: false, error: 'Las contraseñas no coinciden.' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('pages/register', { layout: false, error: 'El formato del email es inválido.' });
    }
    
    if (password.length < 8) {
        return res.render('pages/register', { layout: false, error: 'La contraseña debe tener al menos 8 caracteres.' });
    }


    try {
        const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (userExists) {
            return res.render('pages/register', { layout: false, error: 'El email ya está registrado.' });
        }
        
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        const name = `${nombre} ${apellido}`.trim();
        
        const stmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
        const result = stmt.run(name, email, passwordHash);
        
        req.session.user = {
            id: result.lastInsertRowid,
            name,
            email
        };
        
        return res.redirect('/');
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        return res.render('pages/register', { layout: false, error: 'Ocurrió un error al procesar el registro.' });
    }
});

// Inicio de Sesión
app.get('/login', (req, res) => {
    res.render('pages/login', { layout: false, error: null });
});

app.post('/login', (req, res) => {
    const { user, password } = req.body;
    
    if (!user || !password) {
        return res.render('pages/login', { layout: false, error: 'Por favor, completa todos los campos.' });
    }
    
    try {
        const foundUser = db.prepare('SELECT * FROM users WHERE email = ? OR name = ?').get(user, user);
        
        if (!foundUser) {
            return res.render('pages/login', { layout: false, error: 'El usuario no está registrado. Por favor, regístrate primero.' });
        }
        
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        if (passwordHash !== foundUser.password_hash) {
            return res.render('pages/login', { layout: false, error: 'Usuario o contraseña incorrectos.' });
        }
        
        req.session.user = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email
        };
        
        return res.redirect('/');
    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        return res.render('pages/login', { layout: false, error: 'Ocurrió un error al procesar el inicio de sesión.' });
    }
});

// Cerrar Sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
        }
        res.redirect('/');
    });
});

// 4. Manejo de Error 404 (Debe ir después de todas las rutas)
app.use((req, res) => {
    // Obtenemos 4 productos recomendados al azar para mostrarlos en el carrusel de la página de error 404
    const recommended = productsService.findAll().sort(() => 0.5 - Math.random()).slice(0, 4);
    res.status(404).render('pages/404', { recommended });
});

// 5. Manejo de Error 500 (Debe ir al final de todo)
app.use((err, req, res, next) => {
    console.error('Error interno del servidor:', err.stack);
    res.status(500).render('pages/500');
});

// 4. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT} 🚀`);
});