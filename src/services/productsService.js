const productModel = require('../models/productModel');

const productsService = {
    // Normalizar ID
    normalizeId: (idParam) => {
        const id = Number(idParam);
        if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
            return null; // Retorna null si no es un número válido
        }
        return id;
    },

    // Obtener todos los productos (con opción de ordenamiento)
    findAll: (sortQuery = null) => {
        const products = productModel.findAll();
        
        // Si no hay ordenamiento, retornamos tal cual (o copiamos para seguridad)
        let result = [...products];

        if (sortQuery === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortQuery === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    },

    // Buscar productos por nombre (coincidencia parcial, ignorando mayúsculas/minúsculas)
    searchByName: (query) => {
        if (!query) return [];
        const allProducts = productModel.findAll();
        const searchLower = query.toLowerCase().trim();
        return allProducts.filter(p => p.name.toLowerCase().includes(searchLower));
    },

    // Buscar un producto por su ID
    findById: (id) => {
        return productModel.findById(id);
    },

    // Obtener productos relacionados (misma categoría, distinto ID)
    getRelatedProducts: (product) => {
        if (!product) return [];
        const allProducts = productModel.findAll();
        let related = allProducts.filter(p => p.category === product.category && p.id !== product.id);
        
        // Mezclar si hay más de 4 y seleccionar hasta 4
        return related.sort(() => 0.5 - Math.random()).slice(0, 4);
    },

    // Obtener productos para el Home (recomendados y más pedidos)
    getProductsForHome: () => {
        const allProducts = productModel.findAll();
        
        // "Te puede interesar": 5 productos aleatorios
        const recommended = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        // "Los más pedidos": marcados con un flag y aleatorios (hasta 10)
        const mostRequested = allProducts
            .filter(p => p.mostRequested)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
            
        return { recommended, mostRequested };
    },

    // Filtrar productos por categoría
    getProductsByCategory: (categoryName) => {
        const allProducts = productModel.findAll();
        return allProducts.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
    }
};

module.exports = productsService;
