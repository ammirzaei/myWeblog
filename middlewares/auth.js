exports.authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error','ابتدا باید با حساب خود وارد شوید');
    res.redirect(`/login?redirect=${req.originalUrl}`);
}