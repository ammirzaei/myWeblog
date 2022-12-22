const { Router } = require('express');

const userController = require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();

// Login Page
router.get('/login', userController.getLogin);

// Login Handle
router.post('/login', userController.handleLogin, userController.handleRememberMe);

// Logout Handle
router.get('/logout', authenticated, userController.handleLogout);

// Register Page
router.get('/register', userController.getRegister);

// Register Handle
router.post('/register', userController.postRegister);

module.exports = router;