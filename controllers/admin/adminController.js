const Blog = require('../../models/blogModel');

module.exports.getDashboard = async (req, res) => {
   try {
    const blogs = await Blog.find({
        user : req.user.id
    });
    res.render('admin/dashboard', {
        pageTitle: 'صفحه داشبورد',
        path: '/dashboard',
        layout: './layouts/adminlayout',
        fullName : req.user.fullName,
        blogs 
    });
   } catch (err) {
    console.log(err);
   }
   
}