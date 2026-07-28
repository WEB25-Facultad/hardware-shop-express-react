const express = require('express');
const router = express.Router();
const categoryApiController = require('../../controllers/api/categoryApiController');
const categoryService = require('../../services/categoryService');

// El prefijo /api/categories lo define app.js

// Listar todas las categorías
router.get('/', categoryApiController.list);

// Crear una nueva categoría
router.post('/', categoryApiController.create);

// Obtener una categoría por ID
router.get('/:id', categoryService.normalizeId, categoryApiController.detail);

// Actualizar una categoría por ID
router.put('/:id', categoryService.normalizeId, categoryApiController.update);

// Eliminar una categoría por ID
router.delete('/:id', categoryService.normalizeId, categoryApiController.delete);

module.exports = router;
