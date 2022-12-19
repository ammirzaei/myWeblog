const {registerSchema } = require('../schemas/usersSchema');

const { Router } = require('express');
const Validator = require('fastest-validator');

const router = new Router();
const validator = new Validator();

// Login Page
router.get('/login', (req, res) => {
    res.render('users/login', {
        pageTitle: 'صفحه ورود',
        path: '/login',
        layout: './layouts/usersLayout'
    });
});

// Register Page
router.get('/register', (req, res) => {
    res.render('users/register', {
        pageTitle: 'صفحه ثبت نام',
        path: '/register',
        layout: './layouts/usersLayout',
        errors : undefined
    });
});

// Register Handle
router.post('/register', (req, res) => {
    const validate = validator.validate(req.body, registerSchema);
    const errArr = [];
    if (validate === true) {
        const { fullName, email, password, repassword } = req.body;

        // check equil pass
        if (password !== repassword) {
            errArr.push({ message: 'رمز های عبور یکسان نیستند' , field : 'repassword'});
            return res.render('users/register', {
                pageTitle: 'صفحه ثبت نام',
                path: '/register',
                layout: './layouts/usersLayout',
                errors: errArr
            });
        }

        res.redirect('/login');
    } else {
        res.render('users/register', {
            pageTitle: 'صفحه ثبت نام',
            path: '/register',
            layout: './layouts/usersLayout',
            errors: validate
        })
    }
});

module.exports = router;