const db = require('../../db/database');

// Normalización de Strings: Quita tildes (NFD) y convierte a minúsculas
const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// DTO (Data Transfer Object): Formatea la respuesta de la DB antes de enviarla
const mapCategory = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        // Genera un "slug" (ej: "Mates Eléctricos" -> "mates-electricos") para URLs
        slug: normalizeString(row.name).replace(/\s+/g, '-'),
        description: '',
        status: 'Activo',
        count: row.count || 0
    };
};

const categoryService = {
    // Middleware: Valida que el ID sea numérico y exista en la Base de Datos antes de continuar
    normalizeId: (req, res, next) => {
        const id = Number(req.params.id);
        
        // Detecta si el cliente espera una respuesta JSON (API) o HTML (SSR)
        const isJson = req.originalUrl.startsWith('/api') || req.query.format === 'json' || req.headers.accept?.includes('json') || req.method === 'PUT' || req.method === 'DELETE';
        
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            if (isJson) {
                return res.status(400).json({ error: 'Identificador de categoría inválido' });
            }
            return res.status(400).render('400');
        }

        // Optimización: "SELECT 1" en vez de "SELECT *" es mucho más rápido solo para verificar existencia
        const stmt = db.prepare('SELECT 1 FROM categories WHERE id = ?');
        const exists = stmt.get(id);

        if (!exists) {
            if (isJson) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            return res.status(404).render('404');
        }

        // Si todo está OK, inyectamos el ID limpio en "req" y dejamos pasar la petición
        req.normalizedId = id;
        next();
    },

    findAll: () => {
        // SQL Avanzado: LEFT JOIN para traer cada categoría JUNTO con la cantidad de productos que tiene
        const query = `
            SELECT c.id, c.name, COUNT(p.id) as count 
            FROM categories c
            LEFT JOIN products p ON p.category = c.name
            GROUP BY c.id, c.name
            ORDER BY c.name ASC
        `;
        const rows = db.prepare(query).all();
        return rows.map(mapCategory);
    },

    findById: (id) => {
        const query = `
            SELECT c.id, c.name, COUNT(p.id) as count 
            FROM categories c
            LEFT JOIN products p ON p.category = c.name
            WHERE c.id = ?
            GROUP BY c.id, c.name
        `;
        const row = db.prepare(query).get(id);
        return mapCategory(row);
    },

    create: (data) => {
        const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
        const info = stmt.run(data.name);
        // Retorna la categoría recién creada buscando por el último ID insertado
        return categoryService.findById(info.lastInsertRowid);
    },

    update: (id, data) => {
        const stmt = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
        stmt.run(data.name, id);
        return categoryService.findById(id);
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM categories WHERE id = ?');
        stmt.run(id);
        return true;
    }
};

module.exports = categoryService;