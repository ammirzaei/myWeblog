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

module.exports = router;