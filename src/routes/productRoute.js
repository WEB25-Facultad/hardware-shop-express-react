const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productsService = require('../services/productsService');

// Listado de productos
router.get('/', productController.index);

// Detalle de un producto (ejemplo)
router.get('/:id', productsService.normalizeId, productController.detail);

module.exports = router;
