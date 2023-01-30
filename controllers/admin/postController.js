const path = require('path');
const fs = require('fs');

const Blog = require('../../models/blogModel');
const rootDir = require('../../utils/rootDir');

const shortId = require('shortid');
const sharp = require('sharp');


// Add Post Handler -- POST
module.exports.handleAddPost = async (req, res) => {
    try {
        const image = req.files ? req.files.image : {};

        req.body.image = image; // added image to the body
        // req.body = { ...req.body, image };

        // check model validation
        await Blog.postValidation(req.body);

        const imageName = shortId.generate() + path.extname(image.name);
        const imagePath = `${rootDir}/public/uploads/blogs/${imageName}`;


        // compress image and saved
        await sharp(image.data).jpeg({
            quality: 50
        }).toFile(imagePath).catch((err) => {
            if (err) {
                console.log(err);
                get500(req, res);
            }
        });

        // create post
        await Blog.create({
            ...req.body,
            image: imageName,
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


// Edit Post Handler -- POSt
module.exports.handleEditPost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog)
            get404(req, res);

        debugger;

        const image = req.files ? req.files.image : {};
        if ("name" in image) {
            req.body.image = image;
        } else {
            // create fake image
            req.body.image = {
                name: 'fakeImage',
                size: 66,
                mimetype: 'image/jpeg'
            };
        }

        await Blog.postValidation(req.body); // validation with statics method mongoose
        debugger;
        if (blog.user == req.user.id) {
            const { title, status, body, shortDescription } = req.body; // access to the enterd edit blog

            // set a new value to the blog
            blog.title = title;
            blog.status = status;
            blog.body = body;
            blog.shortDescription = shortDescription;

            // replace new image
            if (req.body.image.name !== 'fakeImage') {
                const imageName = shortId.generate() + path.extname(image.name);
                const imagePath = `${rootDir}/public/uploads/blogs/${imageName}`;

                // deleted old image
                fs.unlink(`${rootDir}/public/uploads/blogs/${blog.image}`, async (err) => {
                    if (err) {
                        console.log(err);
                        get500(req, res);
                    } else {
                        // compress image and saved new image
                        await sharp(image.data).jpeg({
                            quality: 50
                        }).toFile(imagePath).catch((err) => {
                            if (err) {
                                console.log(err);
                                get500(req, res);
                            }
                        });
                    }
                })

                blog.image = imageName;
            }

            // save new blog to the db
            await blog.save();

            res.redirect('/dashboard');
        } else
            return res.redirect('/dashboard');
    } catch (err) {
        debugger;

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
            // deleted from db
            await Blog.findByIdAndDelete(req.params.id);

            const pathImage = `${rootDir}/public/uploads/blogs/${blog.image}`;
            
            // check exist image on folder
            fs.access(pathImage, fs.constants.F_OK, (err) => {
                if (!err) {
                    // deleted image file from folder
                    fs.unlink(pathImage, (err) => {
                        if (err) {
                            console.log(err);
                            get500(req, res);
                        }
                    });
                } else {
                    console.log(err);
                    get500(req, res);
                }
            });

            res.redirect('/dashboard');
        } else
            get404(req, res);

    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}