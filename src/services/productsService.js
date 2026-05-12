const db = require('../../db/database');

// Función auxiliar para mapear los tipos de datos devueltos por SQLite a los esperados por JS
const mapProduct = (row) => {
    if (!row) return null;
    return {
        ...row,
        // En SQLite el boolean se guarda como 0 o 1. Lo pasamos a true/false para mantener la interfaz.
        mostRequested: Boolean(row.mostRequested)
    };
};

const productsService = {
    // Normalizar ID
    normalizeId: (idParam) => {
        const id = Number(idParam);
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            return null;
        }
        return id;
    },

    // Obtener todos los productos desde SQLite (con opción de ordenamiento en la propia query SQL)
    findAll: (sortQuery = null) => {
        let query = 'SELECT * FROM products';
        
        // Delegamos el ordenamiento directamente al motor de base de datos
        if (sortQuery === 'asc') {
            query += ' ORDER BY price ASC';
        } else if (sortQuery === 'desc') {
            query += ' ORDER BY price DESC';
        }

        const rows = db.prepare(query).all();
        return rows.map(mapProduct);
    },

    // Buscar productos por nombre usando SQL LIKE
    searchByName: (query) => {
        if (!query) return [];
        // Se usan parámetros vinculados (?) para prevenir inyección SQL
        const stmt = db.prepare('SELECT * FROM products WHERE name LIKE ?');
        const rows = stmt.all(`%${query}%`);
        return rows.map(mapProduct);
    },

    // Buscar un producto por su ID
    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
        // get() retorna un solo objeto (o undefined si no existe)
        const row = stmt.get(id);
        return mapProduct(row);
    },

    // Obtener hasta 4 productos relacionados aleatorios (misma categoría, distinto ID)
    getRelatedProducts: (product) => {
        if (!product) return [];
        
        const stmt = db.prepare(`
            SELECT * FROM products 
            WHERE category = ? AND id != ? 
            ORDER BY RANDOM() 
            LIMIT 4
        `);
        const rows = stmt.all(product.category, product.id);
        return rows.map(mapProduct);
    },

    // Obtener productos para el Home (recomendados y más pedidos aleatorios)
    getProductsForHome: () => {
        // "Te puede interesar": 5 productos aleatorios
        const recommendedRows = db.prepare('SELECT * FROM products ORDER BY RANDOM() LIMIT 5').all();
        
        // "Los más pedidos": hasta 10 productos con el flag encendido
        const mostRequestedRows = db.prepare('SELECT * FROM products WHERE mostRequested = 1 ORDER BY RANDOM() LIMIT 10').all();
            
        return {
            recommended: recommendedRows.map(mapProduct),
            mostRequested: mostRequestedRows.map(mapProduct)
        };
    },

    // Filtrar productos por categoría exacto
    getProductsByCategory: (categoryName) => {
        // COLLATE NOCASE asegura que la comparación ignore mayúsculas y minúsculas nativamente en SQLite
        const stmt = db.prepare('SELECT * FROM products WHERE category COLLATE NOCASE = ?');
        const rows = stmt.all(categoryName);
        return rows.map(mapProduct);
    }
};

module.exports = productsService;
