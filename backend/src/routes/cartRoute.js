const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const productsService = require('../services/productsService');

// Ver carrito
router.get('/', cartController.index);

// Agregar al carrito
router.post('/add/:id', productsService.normalizeId, cartController.add);

// Aumentar cantidad
router.post('/increase/:id', productsService.normalizeId, cartController.increase);

// Disminuir cantidad
router.post('/decrease/:id', productsService.normalizeId, cartController.decrease);

// Quitar producto
router.post('/remove/:id', productsService.normalizeId, cartController.remove);

// Vaciar carrito
router.post('/clear', cartController.clear);

module.exports = router;
