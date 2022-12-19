const { Router } = require('express');

const userController = require('../controllers/userController');

const router = new Router();

// Login Page
router.get('/login', userController.getLogin);

// Register Page
router.get('/register', userController.getRegister);

// Register Handle
router.post('/register', userController.postRegister);

module.exports = router;