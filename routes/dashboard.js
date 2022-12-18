const {Router} = require('express');

const router = new Router();

// Dashboard Page
router.get('/',(req,res)=>{
    res.render('dashboards/dashboard',{
        pageTitle : 'صفحه داشبورد',
        path : '/dashboard',
        layout : './layouts/dashboardlayout'
    });
});
// Login Page
router.get('/login',(req,res)=>{
    res.render('dashboards/login',{
        pageTitle : 'صفحه ورود',
        path : '/login'
    })
});

module.exports = router;