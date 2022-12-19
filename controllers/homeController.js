
// Home -- GET
module.exports.getHome = (req,res)=>{
    res.render('home/index', {
        pageTitle: 'وبلاگ',
        path: '/'
    });
}

// NotFound -- GET
module.exports.getNotFound = (req,res)=>{
    res.status(404).render('home/notFound', {
        pageTitle: "خطای 404",
        path : '',
        layout: false
    });
}