// EXPLICACIÓN: A diferencia de los otros controladores (donde usabas un "Servicio"), 
// aquí estás importando la base de datos directamente. 
// Nota para el final: En una arquitectura MVC pura y estricta, lo ideal sería que existiera 
// un "statsService.js" que haga esto, pero para un endpoint tan simple y de lectura rápida, 
// a veces se permite esta pequeña "licencia" para ahorrar exceso de archivos.
const db = require('../../../db/database');

const statsApiController = {
    getStats: (req, res) => {
        try {
            // Count products
            const productsStmt = db.prepare('SELECT COUNT(*) as count FROM products');
            const totalProducts = productsStmt.get().count;

            // Count categories
            const categoriesStmt = db.prepare('SELECT COUNT(*) as count FROM categories');
            const totalCategories = categoriesStmt.get().count;

            res.json({
                totalProducts,
                totalCategories
            });
        } catch (error) {
            console.error('Error in API getStats:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = statsApiController;
