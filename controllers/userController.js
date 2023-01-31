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
exports.handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body; // access to the email input

        const user = await User.findOne({ email }); // find user with email

        if (user) {
            // create token with jwt
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

            const resetLink = `${process.env.SITE_URL}/reset-password/${token}`; // create resetlink

            // send email to email user
            console.log(resetLink);

            res.status(200).json({ message: 'ایمیلی حاوی لینک ریست رمز عبور برای شما ارسال شد' });
        } else {
            const error = new Error('کاربری با ایمیل وارد شده یافت نشد');
            error.statusCode = 404;
            throw error;
        }

    } catch (err) {
        next(err);
    }
}

// Reset Password -- POST
exports.handleResetPassword = async (req, res, next) => {
    try {
        await User.resetPasswordValidation(req.body); // validation

        const token = req.params.token; // access to the token

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.userId); // find user
        if (!user) {
            const error = new Error('کاربری با توکن وارد شده یافت نشد');
            error.statusCode = 404;
            return next(error);
        }

        user.password = req.body.password; // replace new password
        await user.save();

        res.status(200).json({ message: 'رمز عبور با موفقیت تغییر کرد' });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            const error = new Error('توکن وارد شده معتبر نیست');
            error.statusCode = 401;
            return next(error);
        }

        const errors = [];
        err.inner.forEach((error) => {
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