const productsService = require('../services/productsService');

const productController = {
    index: (req, res) => {
        const sortQuery = req.query.sort; // Capturamos el query param ?sort=...
        const products = productsService.findAll(sortQuery);
        res.render('products', { products });
    },
    detail: (req, res) => {
        const normalizedId = productsService.normalizeId(req.params.id);
        
        // Si no es un número válido, retornar 400 (Bad Request)
        if (!normalizedId) {
            return res.status(400).send('400 - Bad Request: El ID ingresado no es válido.');
        }

        const product = productsService.findById(normalizedId);
        
        if (product) {
            const related = productsService.getRelatedProducts(product);
            
            res.render('productDetail', { 
                product: product, 
                related: related 
            });
        } else {
            // Si el ID es numérico pero no existe, retornar 404 (Not Found)
            res.status(404).render('404');
        }
    }
};

module.exports = productController;
