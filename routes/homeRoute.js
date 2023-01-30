const { Router } = require('express');

const homeController = require('../controllers/homeController');

const router = new Router();

// Home Page
router.get('/', homeController.getHome);

// Contact us Handler
router.post('/contact-us', homeController.handleContactUs);

// Numeric Captcha
router.get('/captcha.png', homeController.getCaptcha);

// Searching
router.post('/search', homeController.getHome);

module.exports = router;