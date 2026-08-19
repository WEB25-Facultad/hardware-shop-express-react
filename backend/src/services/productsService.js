const db = require('../../db/database');

// DTO (Data Transfer Object): Mapea tipos de datos entre SQLite y JavaScript
const mapProduct = (row) => {
    if (!row) return null;
    return {
        ...row,
        // SQLite no soporta Booleanos puros (guarda 0 o 1). Esto lo reconvierte a true/false.
        mostRequested: Boolean(row.mostRequested)
    };
};

// Normalización para búsquedas insensibles a tildes y mayúsculas
const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const productsService = {
    // Middleware inteligente: Valida el ID y maneja respuestas según el origen (API vs Navegador)
    normalizeId: (req, res, next) => {
        const id = Number(req.params.id);
        const isJson = req.originalUrl.startsWith('/api') || req.query.format === 'json' || req.headers.accept?.includes('json') || req.method === 'PUT' || req.method === 'DELETE';
        
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            if (isJson) return res.status(400).json({ error: 'Identificador inválido' });
            return res.status(400).render('pages/400');
        }

        const stmt = db.prepare('SELECT 1 FROM products WHERE id = ?');
        const exists = stmt.get(id);

        if (!exists) {
            if (isJson) return res.status(404).json({ error: 'Producto no encontrado' });
            
            // UX (User Experience): Si el producto no existe, no mostramos un error vacío.
            // Buscamos 4 productos al azar para recomendarlos en la página de Error 404.
            const recommended = productsService.findAll().sort(() => 0.5 - Math.random()).slice(0, 4);
            return res.status(404).render('pages/404', { recommended });
        }

        req.normalizedId = id;
        next();
    },

    findAll: (sortQuery = null) => {
        let query = 'SELECT * FROM products';
        
        // Optimización: Delegamos el ordenamiento al motor SQL en lugar de usar sort() en JS
        if (sortQuery === 'asc') query += ' ORDER BY price ASC';
        else if (sortQuery === 'desc') query += ' ORDER BY price DESC';

        const rows = db.prepare(query).all();
        return rows.map(mapProduct);
    },

    searchByName: (query) => {
        if (!query) return [];
        // Seguridad: Usamos el parámetro vinculado (?) con operador LIKE para prevenir Inyección SQL
        const stmt = db.prepare('SELECT * FROM products WHERE name LIKE ?');
        const rows = stmt.all(`%${query}%`);
        return rows.map(mapProduct);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
        const row = stmt.get(id);
        return mapProduct(row);
    },

    findByIds: (ids) => {
        if (!ids || ids.length === 0) return [];
        // SQL Dinámico: Crea tantos signos de interrogación como IDs haya (ej: "?, ?, ?")
        const placeholders = ids.map(() => '?').join(',');
        const stmt = db.prepare(`SELECT * FROM products WHERE id IN (${placeholders})`);
        // Usamos el operador spread (...) para pasar el array como argumentos individuales
        const rows = stmt.all(...ids);
        return rows.map(mapProduct);
    },

    getRelatedProducts: (product) => {
        if (!product) return [];
        
        // SQL Avanzado: Mismo rubro, distinto ID, ordenado aleatoriamente y limitado a 4
        const stmt = db.prepare(`
            SELECT * FROM products 
            WHERE category = ? AND id != ? 
            ORDER BY RANDOM() 
            LIMIT 4
        `);
        const rows = stmt.all(product.category, product.id);
        return rows.map(mapProduct);
    },

    getProductsForHome: () => {
        // Obtenemos 5 recomendados aleatorios delegando la aleatoriedad a SQLite
        const recommendedRows = db.prepare('SELECT * FROM products ORDER BY RANDOM() LIMIT 5').all();
        
        // Filtramos por flag Booleano en SQL (mostRequested = 1)
        const mostRequestedRows = db.prepare('SELECT * FROM products WHERE mostRequested = 1 ORDER BY RANDOM() LIMIT 10').all();
            
        return {
            recommended: recommendedRows.map(mapProduct),
            mostRequested: mostRequestedRows.map(mapProduct)
        };
    },

    getProductsByCategory: (categoryName) => {
        const stmt = db.prepare('SELECT * FROM products');
        const rows = stmt.all();
        const target = normalizeString(categoryName);
        // Filtrado en JS para resolver inconsistencias de mayúsculas/tildes 
        return rows
            .filter(p => normalizeString(p.category) === target)
            .map(mapProduct);
    },

    update: (id, data) => {
        const stmt = db.prepare(`
            UPDATE products 
            SET name = ?, price = ?, description = ?, image = ?, category = ?, stock = ?, tienda = ?
            WHERE id = ?
        `);
        stmt.run(data.name, data.price, data.description, data.image, data.category, data.stock, data.tienda, id);
        return productsService.findById(id);
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        stmt.run(id);
        return true;
    },

    create: (data) => {
        const stmt = db.prepare(`
            INSERT INTO products (name, price, description, image, category, stock, tienda)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(data.name, data.price, data.description, data.image, data.category, data.stock, data.tienda);
        return productsService.findById(info.lastInsertRowid);
    }
};

module.exports = productsService;