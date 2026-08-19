const productsService = require('../../services/productsService');

const productApiController = {
    // GET /api/products
    list: (req, res) => {                   // si React hace un fetch a "/api/products?sort=asc solo valdra asc
        try {               // Esto es ideal para enviar filtros, búsquedas u ordenamientos sin cambiar la ruta principal
            const sortQuery = req.query.sort; 
            const products = productsService.findAll(sortQuery);
            res.json(products);
        } catch (error) {
            console.error('Error in API list:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // GET /api/products/:id
    detail: (req, res) => {
        try {
            // El ID ya viene normalizado y validado por productsService.normalizeId
            const product = productsService.findById(req.normalizedId);
            res.json(product);
        } catch (error) {
            console.error('Error in API detail:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // POST /api/products
    create: (req, res) => {
        try {
            let { name, price, stock, description, image, category, tienda } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            let parsedPrice = parseInt(price, 10);
            if (isNaN(parsedPrice)) parsedPrice = 0;

            let parsedStock = parseInt(stock, 10);
            if (isNaN(parsedStock)) parsedStock = 0;

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
        } catch (error) {
            console.error('Error in API create:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // PUT /api/products/:id
    update: (req, res) => {
        try {
            let { name, price, stock, description, image, category, tienda } = req.body; //sacamos los datos pesados

            if (!name || name.trim() === '') {
                return res.status(400).json({ error: 'El nombre es requerido' });
            }

            let parsedPrice = parseInt(price, 10);
            if (isNaN(parsedPrice)) parsedPrice = 0;

            let parsedStock = parseInt(stock, 10);
            if (isNaN(parsedStock)) parsedStock = 0;

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
        } catch (error) {
            console.error('Error in API update:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // DELETE /api/products/:id
    delete: (req, res) => {
        try {
            productsService.delete(req.normalizedId);
            res.json({ success: true, message: 'Producto eliminado correctamente' });
        } catch (error) {
            console.error('Error in API delete:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

module.exports = productApiController;
