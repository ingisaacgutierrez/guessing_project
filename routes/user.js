const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getAll);
router.get('/:id', userController.getSingle);
router.post('/login', userController.login);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
