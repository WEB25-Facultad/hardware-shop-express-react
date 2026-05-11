const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ver carrito
router.get('/', cartController.index);

// Agregar al carrito
router.post('/add/:id', cartController.add);

// Aumentar cantidad
router.post('/increase/:id', cartController.increase);

// Disminuir cantidad
router.post('/decrease/:id', cartController.decrease);

// Quitar producto
router.post('/remove/:id', cartController.remove);

// Vaciar carrito
router.post('/clear', cartController.clear);

module.exports = router;
