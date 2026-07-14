const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productsService = require('../services/productsService');

// Listado de productos
router.get('/', productController.index);

// Detalle de un producto (ejemplo)
router.get('/:id', productsService.normalizeId, productController.detail);

// Editar producto
router.put('/:id/edit', productsService.normalizeId, productController.edit);

// Eliminar producto
router.delete('/:id/delete', productsService.normalizeId, productController.delete);

// Crear producto
router.post('/new', productController.create);

module.exports = router;
