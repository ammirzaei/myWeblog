const { Router } = require('express');

const adminController = require('../controllers/adminController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();

// Dashboard Page
router.get('/', authenticated, adminController.getDashboard);

module.exports = router;