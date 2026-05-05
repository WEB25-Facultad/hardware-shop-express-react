const productModel = require('../models/productModel');

const productController = {
    index: (req, res) => {
        const products = productModel.findAll();
        res.render('products', { products });
    },
    detail: (req, res) => {
        const product = productModel.findById(req.params.id);
        if (product) {
            const allProducts = productModel.findAll();
            // Filtrar productos de la misma categoría, excluyendo el actual
            const related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
            
            // Asegurarnos de que related siempre sea un array, aunque esté vacío
            res.render('productDetail', { 
                product: product, 
                related: related || [] 
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    }
};

module.exports = productController;
