const { Router } = require('express');
const yup = require('yup');
const router = new Router();

// schema validators
const registerSchema = yup.object().shape({
    fullName: yup.string().required().min(10).max(150),
    email: yup.string().email().required(),
    password: yup.string().required().min(8,'رمز عبور باید حداقل دارای 8 کاراکتر باشد').max(150),
    repassword: yup.string().required().oneOf([yup.ref('password'), null],'رمز های عبور با هم یکسان نیست')
});

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
        layout: './layouts/usersLayout'
    });
});

// Register Handle
router.post('/register', (req, res) => {
    // const validator = registerSchema.isValid(req.body);
    // validator.then((result) => {
    //     if (result === true)
    //         res.send('All Good');
    //     else
    //         res.send('error');
    // });
    registerSchema.validate(req.body).then(result=>{
        res.send('all Good');
    }).catch(err=>{
        res.send(err);
    });
});

module.exports = router;