const productsService = require('../services/productsService');
// Importamos el servicio de categorías para cargar el listado en la vista de detalle
const categoryService = require('../services/categoryService');

const productController = {
    index: (req, res) => {
        const sortQuery = req.query.sort; 
        const products = productsService.findAll(sortQuery);
        
        // Renderiza la lista de catálogo desde views/pages/
        res.render('pages/products', { products });
    },
    detail: (req, res) => {
        // La validación 400 y 404 ya la hizo el middleware normalizeId
        const product = productsService.findById(req.normalizedId);
        
        const related = productsService.getRelatedProducts(product);
        
        // Obtenemos todas las categorías registradas en SQLite para mostrarlas en el panel inferior
        const categories = categoryService.findAll();
        
        // Renderiza la ficha de detalle de producto desde views/pages/product.ejs
        res.render('pages/product', { 
            product: product, 
            related: related,
            categories: categories
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
