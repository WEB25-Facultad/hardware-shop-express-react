const express = require('express');
const router = express.Router();
const userApiController = require('../../controllers/api/userApiController');

router.get('/', userApiController.getUsers);
router.get('/:id', userApiController.getUserById);
// Ruta POST para registrar usuarios desde el Dashboard
router.post('/', userApiController.createUser);
router.put('/:id', userApiController.updateUser);
router.delete('/:id', userApiController.deleteUser);

module.exports = router;
