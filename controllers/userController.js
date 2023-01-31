const User = require('../models/userModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login Handle -- POST
module.exports.handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('کاربری با ایمیل وارد شده یافت نشد');
            error.statusCode = 404;

            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('ایمیل یا رمزعبور اشتباه است');
            error.statusCode = 401;

            throw error;
        }

        const token = jwt.sign({
            user: {
                userId: user.id,
                email: user.email,
                fullName: user.fullName
            }
        }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};


// Register -- POST
module.exports.postRegister = async (req, res, next) => {
    try {
        await User.userValidation(req.body);
        const { fullName, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            const error = new Error('ایمیل وارد شده تکراری است');
            error.statusCode = 422;
            error.data = {
                name: 'email',
                message: 'ایمیل وارد شده تکراری است'
            };
            return next(error);
        }

        const newUser = await User.create({
            fullName,
            email,
            password
        });

        // send Email for welcome

        res.status(201).json({ message: 'کاربر جدید با موفقیت ثبت نام شد', userId: newUser.id });

    } catch (err) {
        const errors = [];

        err.inner.forEach(error => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        const error = new Error('در اعتبارسنجی فیلد ها مشکلی وجود دارد');
        error.statusCode = 422;
        error.data = errors;
        next(error);
    }
}

// Forget Password -- POST
exports.handleForgetPassword = async (req, res) => {
    try {
        const resRecaptcha = req.body['g-recaptcha-response']; // access to the recaptcha response

        if (!resRecaptcha) {
            req.flash('Error', 'CAPTCHA را تایید کنید');
            return res.redirect('/forget-password');
        }

        if (!reChaptcha(resRecaptcha, req.ip)) {
            req.flash('Error', 'اعتبارسنجی CAPTCHA موفقیت آمیز نبود');
            return res.redirect('/forget-password');
        }

        const { email } = req.body; // access to the email input

        const user = await User.findOne({ email }); // find user with email

        if (user) {
            // create token with jwt
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

            const resetLink = `http://localhost:3000/reset-password/${token}`; // create resetlink

            // send email to email user
            console.log(resetLink);

            req.flash('Success', 'ایمیلی حاوی تغییر رمز عبور برای شما ارسال شد.');
            res.redirect('/forget-password');
        } else {
            req.flash('Error', 'کاربری با ایمیل وارد شده یافت نشد');
            return res.redirect('/forget-password');
        }

    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}

// Reset Password -- GET
module.exports.getResetPassword = async (req, res) => {
    let decodedToken;
    try {
        const token = req.params.token; // access to the token

        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // auth token

        res.render('users/resetPassword', {
            pageTitle: 'ریست رمز عبور',
            path: '/user',
            success: req.flash('Success'),
            error: req.flash('Error'),
            userId: decodedToken.userId,
            errors: []
        });
    } catch (err) {
        if (!decodedToken) {
            get404(req, res); // invalid token
        }

        console.log(err);
        get500(req, res);
    }
}

// Reset Password -- POST
exports.handleResetPassword = async (req, res) => {
    const userId = req.params.id; // access to the user id

    try {
        await User.resetPasswordValidation(req.body); // validation

        const user = await User.findById(userId); // find user

        if (!user)
            get404(req, res);

        user.password = req.body.password; // replace new password
        await user.save();

        req.flash('Success', 'رمز عبور با موفقیت تغییر یافت');
        res.redirect('/login');

    } catch (err) {
        const errors = [];

        err.inner.forEach((error) => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        res.render('users/resetPassword', {
            pageTitle: 'ریست رمز عبور',
            path: '/user',
            errors,
            success: req.flash('Success'),
            error: req.flash('Error'),
            userId
        });
    }
}