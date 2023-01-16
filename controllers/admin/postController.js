const Blog = require('../../models/blogModel');
const { get500, get404 } = require('../errorController');

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
        await Blog.postValidation(req.body);

        // create post
        await Blog.create({
            ...req.body,
            user: req.user.id
        });

        res.redirect('/dashboard');

    } catch (err) {
        const errors = [];

        // push all errors in postValidation
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

// Edit Post -- GET
module.exports.getEditPost = async (req, res) => {
    try {
        const blogId = req.params.id; // get blog id from url

        const blog = await Blog.findById(blogId);
        if (blog) {
            if (blog.user == req.user.id) {
                res.render('admin/posts/editPost', {
                    pageTitle: 'ویرایش پست',
                    path: '/dashboard/edit-post',
                    layout: './layouts/adminLayout',
                    fullName: req.user.fullName,
                    blog,
                    errors: []
                });
            } else
                return res.redirect('/dashboard');
        } else {
            get404(req, res);
        }
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}

// Edit Post Handler -- POSt
module.exports.handleEditPost = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
        get404(req, res);
    try {
        await Blog.postValidation(req.body); // validation with statics method mongoose

        if (blog.user == req.user.id) {
            const { title, status, body } = req.body; // access to the enterd edit blog

            // set a new value to the blog
            blog.title = title;
            blog.status = status;
            blog.body = body;

            // save new blog to the db
            await blog.save();

            res.redirect('/dashboard');
        } else
            return res.redirect('/dashboard');
    } catch (err) {
        const errors = [];

        err.inner.forEach(error => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        res.render('admin/posts/editPost', {
            pageTitle: 'ویرایش پست',
            path: '/dashboard/edit-post',
            layout: './layouts/adminLayout',
            fullName: req.user.fullName,
            blog,
            errors
        });
    }
}

// Delete Post -- GET
module.exports.getDeletePost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id); // find blog with param id

        if (blog.user != req.user.id) 
            return res.redirect('/dashboard');

        if (blog) {
            await Blog.findByIdAndDelete(req.params.id); // deleted from db
            res.redirect('/dashboard');
        } else
            get404(req, res);

    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}