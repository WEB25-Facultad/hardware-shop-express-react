const productsService = require('../services/productsService');

const productController = {
    index: (req, res) => {
        const sortQuery = req.query.sort; // Capturamos el query param ?sort=...
        const products = productsService.findAll(sortQuery);
        res.render('products', { products });
    },
    detail: (req, res) => {
        // La validación 400 y 404 ya la hizo el middleware normalizeId
        const product = productsService.findById(req.normalizedId);
        const related = productsService.getRelatedProducts(product);
        
        res.render('productDetail', { 
            product: product, 
            related: related 
        });
    }
};

module.exports = productController;
