const { Router } = require('express');

const router = new Router();

//// Routes

// Home Page
router.get('/', (req, res) => {
    res.render('index', {
        pageTitle: 'وبلاگ',
        path : '/'
    });
});

module.exports = router;