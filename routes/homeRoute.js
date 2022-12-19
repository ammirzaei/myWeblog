const { Router } = require('express');

const homeController = require('../controllers/homeController');

const router = new Router();

// Home Page
router.get('/', homeController.getHome);

// NotFound Page
router.use(homeController.getNotFound);

module.exports = router;