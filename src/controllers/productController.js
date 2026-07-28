const productsService = require('../services/productsService');

const productController = {
    index: (req, res) => {
        const sortQuery = req.query.sort; 
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
    },
    edit: (req, res) => {
        let { name, price, valor, stock, description, image, category, tienda } = req.body;
        
        // El precio puede venir como 'price' o 'valor'
        const finalPrice = price !== undefined ? price : valor;

        // Validaciones
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        let parsedPrice = parseInt(finalPrice, 10);
        if (isNaN(parsedPrice)) {
            parsedPrice = 0;
        }

        let parsedStock = parseInt(stock, 10);
        if (isNaN(parsedStock)) {
            parsedStock = 0;
        }

        const updatedProduct = productsService.update(req.normalizedId, {
            name: name.trim(),
            price: parsedPrice,
            description: description ? description.trim() : '',
            image: image ? image.trim() : '',
            category: category ? category.trim() : '',
            stock: parsedStock,
            tienda: tienda ? tienda.trim() : ''
        });

        res.json(updatedProduct);
    },
    delete: (req, res) => {
        productsService.delete(req.normalizedId);
        res.json({ success: true, message: 'Producto eliminado correctamente' });
    },
    create: (req, res) => {
        let { name, price, valor, stock, description, image, category, tienda } = req.body;
        const finalPrice = price !== undefined ? price : valor;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'El nombre es requerido' });
        }

        let parsedPrice = parseInt(finalPrice, 10);
        if (isNaN(parsedPrice)) {
            parsedPrice = 0;
        }

        let parsedStock = parseInt(stock, 10);
        if (isNaN(parsedStock)) {
            parsedStock = 0;
        }

        const newProduct = productsService.create({
            name: name.trim(),
            price: parsedPrice,
            description: description ? description.trim() : '',
            image: image ? image.trim() : '',
            category: category ? category.trim() : 'Otros',
            stock: parsedStock,
            tienda: tienda ? tienda.trim() : 'Olivia Store'
        });

        res.status(201).json(newProduct);
    }
};

module.exports = productController;
