const User = require('../models/userModel');
const { get500 } = require('./errorController');

const fetch = require('node-fetch');
const passport = require('passport');
const urlLocal = require('url-local');

// Login -- GET
module.exports.getLogin = (req, res) => {
    if (req.isAuthenticated())
        return res.redirect('/');

    // console.log(req.headers.referer);

    res.render('users/login', {
        pageTitle: 'صفحه ورود',
        path: '/login',
        layout: './layouts/usersLayout',
        message: req.flash('Success_Register'),
        error: req.flash('error'),
        redirect: req.query.redirect
    });
}

// Login Handle -- POST
module.exports.handleLogin = async (req, res, next) => {
    try {
        const resRecaptcha = req.body['g-recaptcha-response'];

        if (!resRecaptcha) {
            req.flash('error', 'CAPTCHA را تایید کنید');
            return res.redirect('/login');
        }
        if (reChaptcha(resRecaptcha, req.connection.remoteAddress)) {
            const urlRedirect = req.body.redirect.trim();
            passport.authenticate('local', {
                failureRedirect: '/login',
                failureFlash: true,
                successRedirect: urlLocal(urlRedirect) ? urlRedirect : ''
            })(req, res, next);
        } else {
            req.flash('error', 'اعتبارسنجی CAPTCHA موفقیت آمیز نبود');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
        get500(req, res);
    }
};

// Get response in google recaptcha
async function reChaptcha(resRecaptcha, remoteIp) {
    const verify = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${resRecaptcha}&remoteip=${remoteIp}`;

    const response = await fetch(verify, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
    });
    const resJson = await response.json();
    return resJson.success;
}

// RememberMe Handle -- POST
exports.handleRememberMe = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = (3600 * 1000) * 24 * 7; // 7 day
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect('/dashboard');
}

// Logout Handle -- GET
module.exports.handleLogout = (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
        res.redirect('/');
    });
}

// Register -- GET
module.exports.getRegister = (req, res) => {
    res.render('users/register', {
        pageTitle: 'صفحه ثبت نام',
        path: '/register',
        layout: './layouts/usersLayout',
        errors: []
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

        // const hash = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            password
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