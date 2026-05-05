const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Listado de productos
router.get('/', productController.index);

// Detalle de un producto (ejemplo)
router.get('/:id', productController.detail);

module.exports = router;
