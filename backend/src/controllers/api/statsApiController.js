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
