const User = require('../models/userModel');

// Login -- GET
module.exports.getLogin = (req,res)=>{
    res.render('users/login', {
        pageTitle: 'صفحه ورود',
        path: '/login',
        layout: './layouts/usersLayout'
    });
}
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
    try {
        await User.userValidation(req.body);

        // database code
        res.redirect('/login');
    } catch (err) {
        const errors = [];
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