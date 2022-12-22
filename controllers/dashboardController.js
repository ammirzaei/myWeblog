module.exports.getDashboard = (req, res) => {
    res.render('dashboards/dashboard', {
        pageTitle: 'صفحه داشبورد',
        path: '/dashboard',
        layout: './layouts/dashboardlayout'
    });
}