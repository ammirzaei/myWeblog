exports.authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error','ابتدا با حساب خود وارد شوید')
    res.redirect('/login');
}