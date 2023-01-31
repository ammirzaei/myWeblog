const { Router } = require('express');

const userController = require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();

// Login Handle
router.post('/login', userController.handleLogin);

// Register Handle
router.post('/register', userController.postRegister);

// Forget Password Handle
router.post('/forget-password', userController.handleForgetPassword);

// Reset Password Handle
router.post('/reset-password/:token', userController.handleResetPassword);

module.exports = router;