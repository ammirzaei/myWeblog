const { Router } = require('express');
const yup = require('yup');
const router = new Router();

// schema validators
const registerSchema = yup.object().shape({
    fullName: yup.string().required('نام و نام خانوادگی اجباری است').min(6,'نام و نام خانوادگی باید حداقل دارای 6 کاراکتر باشد').max(150,'نام و نام خانوادگی باید حداکثر دارای 150 کاراکتر باشد'),
    email: yup.string().email('ایمیل وارد شده معتبر نیست').required('ایمیل اجباری است'),
    password: yup.string().required('رمز عبور اجباری است').min(8,'رمز عبور باید حداقل دارای 8 کاراکتر باشد').max(150,'رمز عبور باید حداکثر دارای 150 کاراکتر باشد'),
    repassword: yup.string().required('تکرار رمز عبور اجباری است').oneOf([yup.ref('password'), null],'رمز های عبور با هم یکسان نیست')
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
        res.redirect('/login');
    }).catch(err=>{
        res.render('users/register',{
            pageTitle: 'صفحه ثبت نام',
            path: '/register',
            layout: './layouts/usersLayout',
            errors : err.errors
        });
    });
});

module.exports = router;