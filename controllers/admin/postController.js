module.exports.getAddPost = (req,res)=>{
    res.render('admin/posts/addPost',{
        pageTitle : 'افزودن پست جدید',
        path : '/dashboard/add-post',
        layout : './layouts/adminLayout',
        fullName : req.user.fullName
    });
}