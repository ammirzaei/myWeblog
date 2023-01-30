const { Router } = require('express');

const adminController = require('../../controllers/admin/adminController');

const router = new Router();

// Upload Image
router.post('/image-upload', adminController.uploadImage);

module.exports = router;