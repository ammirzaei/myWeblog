const {Router} = require('express');

const router = new Router();

// Login Page
router.get('/login',(req,res)=>{
    res.render('login',{
        pageTitle : 'صفحه ورود',
        path : '/login'
    })
});

module.exports = router;