const Blog = require('../../models/blogModel');

// Add Post -- GET
module.exports.getAddPost = (req, res) => {
    res.render('admin/posts/addPost', {
        pageTitle: 'افزودن پست جدید',
        path: '/dashboard/add-post',
        layout: './layouts/adminLayout',
        fullName: req.user.fullName,
        errors: []
    });
}

// Add Post Handler -- POST
module.exports.handleAddPost = async (req, res) => {
    try {
        // check model validation
        await Blog.addPostValidation(req.body);

        // create post
        await Blog.create({
            ...req.body,
            user: req.user.id
        });

        res.redirect('/dashboard');

    } catch (err) {
        const errors = [];

        // push all errors in addPostValidation
        err.inner.forEach(error => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        res.render('admin/posts/addPost', {
            pageTitle: 'افزودن پست جدید',
            path: '/dashboard/add-post',
            layout: './layouts/adminLayout',
            fullName: req.user.fullName,
            errors
        });
    }
}