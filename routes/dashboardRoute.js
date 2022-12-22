const { Router } = require('express');

const dashboardController = require('../controllers/dashboardController');
const { authenticated } = require('../middlewares/auth');

const router = new Router();

// Dashboard Page
router.get('/', authenticated, dashboardController.getDashboard);

module.exports = router;