const Blog = require('../models/blogModel');
const { formatDate } = require('../utils/jalali');

module.exports.getBlog = async (req, res) => {
    try {
        const blogID = req.params.id; // access with blog ID

        const blog = await Blog.findById(blogID).populate('user'); // find blog with blog ID

        if (blog && blog.status === 'عمومی') {
            res.render('blogs/blog', {
                pageTitle: blog.title,
                path: '/blog',
                blog,
                formatDate
            });
        } else
            get404(req, res);
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}