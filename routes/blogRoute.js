const { Router } = require('express');

const router = new Router();
const blogController = require('../controllers/blogController');

// Show Blog -- GET
router.get('/blog/:id', blogController.getBlog);

module.exports = router;