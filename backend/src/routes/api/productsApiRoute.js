const express = require('express');
const router = express.Router();
const productApiController = require('../../controllers/api/productApiController');
const productsService = require('../../services/productsService');

// El prefijo /api/products lo define app.js

// Listar todos los productos
router.get('/', productApiController.list);

// Crear un nuevo producto
router.post('/', productApiController.create);

// Obtener un producto por ID
router.get('/:id', productsService.normalizeId, productApiController.detail);

// Actualizar un producto por ID
router.put('/:id', productsService.normalizeId, productApiController.update);

// Eliminar un producto por ID
router.delete('/:id', productsService.normalizeId, productApiController.delete);

module.exports = router;
