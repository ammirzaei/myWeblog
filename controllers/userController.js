const User = require('../models/userModel');

const bcrypt = require('bcrypt');
const passport = require('passport');

// Login -- GET
module.exports.getLogin = (req, res) => {
    res.render('users/login', {
        pageTitle: 'صفحه ورود',
        path: '/login',
        layout: './layouts/usersLayout',
        message: req.flash('Success_Register'),
        error : req.flash('error')
    });
}

// Login Handle -- POST
module.exports.handleLogin = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
};

// Register -- GET
module.exports.getRegister = (req, res) => {
    res.render('users/register', {
        pageTitle: 'صفحه ثبت نام',
        path: '/register',
        layout: './layouts/usersLayout',
        errors: undefined
    });
}

// Register -- POST
module.exports.postRegister = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullName, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            errors.push({
                name: 'email',
                message: 'ایمیل وارد شده تکراری است'
            });
            return res.render('users/register', {
                pageTitle: 'صفحه ثبت نام',
                path: '/register',
                layout: './layouts/usersLayout',
                errors
            });
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            password: hash
        });

        req.flash('Success_Register', 'ثبت نام شما با موفقیت انجام شد');
        res.redirect('/login');


        // bcrypt.genSalt(10, (err, salt) => {
        //     if (err) throw err;
        //     bcrypt.hash(password, salt, async (err, hash) => {
        //         if (err) throw err;
        //         await User.create({
        //             fullName,
        //             email,
        //             password: hash
        //         });
        //         res.redirect('/login');
        //     });
        // });

        // // database code
        // const userN = new User({ // instance from user
        //     fullName : req.body.fullName,
        //     email : req.body.email,
        //     password : req.body.password
        // });
        // await userN.save().then(()=>{
        //     res.redirect('/login');
        // });
    } catch (err) {
        err.inner.forEach(error => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        return res.render('users/register', {
            pageTitle: 'صفحه ثبت نام',
            path: '/register',
            layout: './layouts/usersLayout',
            errors
        });
    }
}