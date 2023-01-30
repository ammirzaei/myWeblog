const { Router } = require('express');

const adminController = require('../../controllers/admin/adminController');

const router = new Router();

// admin Page
router.get('/', adminController.getDashboard);

// Searching
router.post('/search', adminController.getDashboard);

// Upload Image
router.post('/image-upload', adminController.uploadImage);

module.exports = router;