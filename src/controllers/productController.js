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
            let related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
            
            // Mezclar si hay más de 4 y seleccionar hasta 4 (Escenarios 1 y 2)
            related = related.sort(() => 0.5 - Math.random()).slice(0, 4);
            
            // Asegurarnos de que related siempre sea un array, aunque esté vacío
            res.render('productDetail', { 
                product: product, 
                related: related || [] 
            });
        } else {
            res.status(404).render('404');
        }
    }
};

module.exports = productController;
