const path = require('path');

const multer = require('multer');
const sharp = require('sharp');
// const uuid = require('uuid').v4;
const shortId = require('shortid');

const Blog = require('../../models/blogModel');
const { formatDateTime } = require('../../utils/jalali');
const { get500 } = require('../errorController');
const { fileFilter, storage } = require('../../utils/multer');
const rootDir = require('../../utils/rootDir');


// Dashboard Page -- GET
module.exports.getDashboard = async (req, res) => {
    try {
        const pageId = +req.query.pageId || 1; // aceess to the page id for paging
        const blogPerPage = 2; // limit blog

        const search = req.body.search;

        let countBlogs;
        let blogs;
        if (search) {
            countBlogs = await Blog.count({ user: req.user.id, $text: { $search: search } }); // get count blog user

            blogs = await Blog.find({
                user: req.user.id,
                $text: { $search: search }
            }).skip((pageId - 1) * blogPerPage)
                .limit(blogPerPage);
        } else {
            countBlogs = await Blog.count({ user: req.user.id }); // get count blog user

            blogs = await Blog.find({
                user: req.user.id
            }).skip((pageId - 1) * blogPerPage)
                .limit(blogPerPage);
        }

        const pagination = {
            currentPage: pageId,
            nextPage: pageId + 1,
            previousPage: pageId - 1,
            hasNextPage: (pageId * blogPerPage) < countBlogs,
            hasPreviousPage: pageId > 1,
            lastPage: Math.ceil(countBlogs / blogPerPage)
        };

        // set header for clear backward
        res.set('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

        res.render('admin/dashboard', {
            pageTitle: 'صفحه داشبورد',
            path: '/dashboard',
            layout: './layouts/adminlayout',
            fullName: req.user.fullName,
            blogs,
            formatDateTime,
            pagination
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }

}

// Upload Image
module.exports.uploadImage = async (req, res) => {
    // // const fileName = uuid() + path.extname(req.file.fileName);
    // const upload = multer({
    //     limits: {
    //         fileSize: 4200000,
    //         files: 1
    //     },
    //     // dest: 'uploads/img/',
    //     // storage,
    //     fileFilter
    // }).single('image');

    // upload(req, res, async (err) => {
    //     // this upload just file exist
    //     if (err) {
    //         if (err.code === 'LIMIT_FILE_SIZE') { // limit : fileSize
    //             return res.status(400).send('حجم عکس باید کمتر از 4 مگابایت باشد');
    //         }
    //         res.status(400).send(err);
    //     } else {
    //         if (req.file) {
    //             const fileName = shortId.generate() + path.extname(req.file.originalname);
    //             await sharp(req.file.buffer).jpeg({
    //                 quality: 60
    //             }).toFile(`./public/uploads/img/${fileName}`)
    //                 .catch(err => console.log(err));

    //             const url = `http://localhost:3000/uploads/img/${fileName}`;
    //             res.status(200).set('url', url).send('آپلود عکس موفقیت آمیز بود');
    //         }
    //         else
    //             res.status(400).send('ابتدا عکسی را انتخاب کنید');
    //     }
    // })

    try {
        if (req.files) {
            const image = req.files.imageUpload; // access to the image upload

            // Validation
            // Size
            if (image.size > 4200000) {
                return res.status(400).send('حجم عکس نباید بیشتر از 4 مگابایت باشد');
            }
            // Type
            if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
                return res.status(400).send('تنها فرمت های JPEG و PNG را میتوانید آپلود کنید');
            }

            const imageName = shortId.generate() + path.extname(image.name);
            const imagePath = `${rootDir}/public/uploads/img/${imageName}`;

            // compressed and saved image to the folder
            await sharp(image.data).jpeg({
                quality: 50
            }).toFile(imagePath).catch((err) => {
                res.status(400).send('در فرایند ذخیره عکس مشکلی رخ داد');
            });

            // create url image for send on header 
            const url = `http://localhost:3000/uploads/img/${imageName}`;

            res.status(200).set('url', url).send('آپلود عکس با موفقیت انجام شد');
        } else {
            res.status(400).send('ابتدا عکسی انتخاب کنید');
        }
    } catch (err) {
        res.status(400).send('در فرایند آپلود مشکلی رخ داد');
    }
}