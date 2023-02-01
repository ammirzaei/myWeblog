const path = require('path');
const fs = require('fs');

const Blog = require('../../models/blogModel');
const rootDir = require('../../utils/rootDir');

const shortId = require('shortid');
const sharp = require('sharp');


// Add Post Handler -- POST
module.exports.handleAddPost = async (req, res, next) => {
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
                const error = new Error('در فرآیند ذخیره سازی عکس مشکلی رخ داد');
                error.data = err;
                return next(error);
            }
        });

        // create post
        await Blog.create({
            ...req.body,
            image: imageName,
            user: req.userId
        });

        res.status(201).json({ message: 'پست جدید با موفقیت ساخته شد' });

    } catch (err) {
        const errors = [];

        // push all errors in postValidation
        err.inner.forEach(error => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });

        const error = new Error('در اعتبارسنجی فیلد ها مشکلی وجود دارد');
        error.statusCode = 422;
        error.data = errors;

        next(error);
    }
}


// Edit Post Handler -- POSt
module.exports.handleEditPost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            const error = new Error("پستی با شناسه وارد شده یافت نشد");
            error.statusCode = 404;

            throw error;
        }

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

        if (blog.user == req.userId) {
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
                        const error = new Error('در فرآیند جایگزینی عکس جدید مشکلی رخ داد');
                        error.data = err;
                        throw error;
                    } else {
                        // compress image and saved new image
                        await sharp(image.data).jpeg({
                            quality: 50
                        }).toFile(imagePath).catch((err) => {
                            if (err) {
                                const error = new Error('در فرآیند ذخیره سازی عکس جدید مشکلی رخ داد');
                                error.data = err;
                                throw error;
                            }
                        });
                    }
                })

                blog.image = imageName;
            }

            // save new blog to the db
            await blog.save();

            res.status(201).json({ message: 'پست با موفقیت ویرایش شد' });
        } else {
            const error = new Error('شما به این پست دسترسی ندارید');
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        if (err.inner) {
            const errors = [];

            err.inner.forEach(error => {
                errors.push({
                    name: error.path,
                    message: error.message
                });
            });

            const error = new Error('در اعتبارسنجی فیلد ها مشکلی  وجود دارد');
            error.statusCode = 422;
            error.data = errors;

            return next(error);
        } else {
            return next(err);
        }
    }
}

// Delete Post -- GET
module.exports.handleDeletePost = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id); // find blog with param id

        if (blog) {
            if (blog.user != req.userId) {
                const error = new Error('شما به این پست دسترسی ندارید');
                error.statusCode = 401;
                throw error;
            }

            // deleted from db
            await Blog.findByIdAndDelete(req.params.id);

            const pathImage = `${rootDir}/public/uploads/blogs/${blog.image}`;

            // check exist image on folder
            fs.access(pathImage, fs.constants.F_OK, (err) => {
                if (!err) {
                    // deleted image file from folder
                    fs.unlink(pathImage, (err) => {
                        if (err) {
                            const error = new Error('در فرآیند حذف عکس مشکلی رخ داد');
                            error.data = err;
                            throw error;
                        }
                    });
                } else {
                    const error = new Error('در فرآیند حذف عکس مشکلی رخ داد');
                    error.data = err;
                    throw error;
                }
            });

            res.status(201).json({ message: 'پست با موفقیت حذف شد' });
        } else {
            const error = new Error('پستی با شناسه وارد شده یافت نشد');
            error.statusCode = 404;
            throw error;
        }

    } catch (err) {
        next(err);
    }
}