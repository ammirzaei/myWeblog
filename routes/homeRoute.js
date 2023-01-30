const { Router } = require('express');

const homeController = require('../controllers/homeController');

const router = new Router();

// Home
router.get('/', homeController.getHome);

// Contact Us Page
router.get('/contact-us', homeController.getContactUs);

// Contact us Handler
router.post('/contact-us', homeController.handleContactUs);

// Numeric Captcha
router.get('/captcha.png', homeController.getCaptcha);

// Searching
router.post('/search', homeController.getHome);

module.exports = router;