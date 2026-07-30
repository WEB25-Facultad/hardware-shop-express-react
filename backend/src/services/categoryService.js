const db = require('../../db/database');

const normalizeString = (str) => {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const mapCategory = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        // Mock data to satisfy frontend without altering database
        slug: normalizeString(row.name).replace(/\s+/g, '-'),
        description: '',
        status: 'Activo',
        count: row.count || 0
    };
};

const categoryService = {
    // Middleware: Normalizar ID y validar existencia
    normalizeId: (req, res, next) => {
        const id = Number(req.params.id);
        const isJson = req.originalUrl.startsWith('/api') || req.query.format === 'json' || req.headers.accept?.includes('json') || req.method === 'PUT' || req.method === 'DELETE';
        
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            if (isJson) {
                return res.status(400).json({ error: 'Identificador de categoría inválido' });
            }
            return res.status(400).render('400');
        }

        // Validar que exista
        const stmt = db.prepare('SELECT 1 FROM categories WHERE id = ?');
        const exists = stmt.get(id);

        if (!exists) {
            if (isJson) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            return res.status(404).render('404');
        }

        req.normalizedId = id;
        next();
    },

    findAll: () => {
        // Obtenemos categorías con count de productos para el listado
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
