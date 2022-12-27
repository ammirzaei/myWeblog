module.exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', {
        pageTitle: 'صفحه داشبورد',
        path: '/dashboard',
        layout: './layouts/adminlayout',
        fullName : req.user.fullName
    });
}