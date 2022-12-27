const { Router } = require('express');

const adminController = require('../../controllers/admin/adminController');

const router = new Router();

// admin Page
router.get('/', adminController.getDashboard);

module.exports = router;