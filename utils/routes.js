const { authenticated } = require('../middlewares/auth');


module.exports.setRoutes = (app) => {
    app.use('/dashboard', authenticated, require('../routes/admin/adminRoute'));
    app.use('/', authenticated, require('../routes/admin/postRoute'))

    app.use(require('../routes/userRoute'));
    app.use('/', require('../routes/homeRoute'));
}