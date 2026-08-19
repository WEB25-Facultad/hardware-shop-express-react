const express = require('express');
const router = express.Router();
const userApiController = require('../../controllers/api/userApiController');

// Colección completa (Lista)
router.get('/', userApiController.getUsers);

// Recurso individual por parámetro dinámico (:id)
router.get('/:id', userApiController.getUserById);

// Ruta POST para registrar usuarios desde el Dashboard (o desde la web)
router.post('/', userApiController.createUser);

// Ruta PUT para modificar datos existentes (Ej: cambiar el Rol a "Admin")
router.put('/:id', userApiController.updateUser);

// Ruta DELETE para eliminar usuarios
router.delete('/:id', userApiController.deleteUser);

module.exports = router;