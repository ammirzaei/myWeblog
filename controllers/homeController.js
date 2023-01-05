// Home -- GET
module.exports.getHome = (req,res)=>{
    res.render('home/index', {
        pageTitle: 'وبلاگ',
        path: '/'
    });
}
