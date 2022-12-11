const { Router } = require('express');

const router = new Router();

// Routes
router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'وبلاگ'
    });
});

module.exports = router;