const { Router } = require('express');

const userController = require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();

// Login Handle
router.post('/login', userController.handleLogin, userController.handleRememberMe);

// Logout Handle
router.get('/logout', authenticated, userController.handleLogout);

// Register Handle
router.post('/register', userController.postRegister);

// Forget Password Handle
router.post('/forget-password', userController.handleForgetPassword);

// Reset Password Page
router.get('/reset-password/:token', userController.getResetPassword);

// Reset Password Handle
router.post('/reset-password/:id', userController.handleResetPassword);

module.exports = router;