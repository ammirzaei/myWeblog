const { Router } = require('express');

const dashboardController = require('../controllers/dashboardController');

const router = new Router();

// Dashboard Page
router.get('/', dashboardController.getDashboard);

module.exports = router;