const path = require('path');

const multer = require('multer');
const sharp = require('sharp');
// const uuid = require('uuid').v4;
const shortId = require('shortid');

const Blog = require('../../models/blogModel');
const { formatDate } = require('../../utils/jalali');
const { get500 } = require('../errorController');
const { fileFilter, storage } = require('../../utils/multer');
const rootDir = require('../../utils/rootDir');


// Dashboard Page -- GET
module.exports.getDashboard = async (req, res) => {
    try {
        const pageId = +req.query.pageId || 1; // aceess to the page id for paging
        const blogPerPage = 2; // limit blog

        const countBlogs = await Blog.count({ user: req.user.id }); // get count blog user

        const blogs = await Blog.find({
            user: req.user.id
        }).skip((pageId - 1) * blogPerPage)
            .limit(blogPerPage);

        const pagination = {
            currentPage: pageId,
            nextPage: pageId + 1,
            previousPage: pageId - 1,
            hasNextPage: (pageId * blogPerPage) < countBlogs,
            hasPreviousPage: pageId > 1,
            lastPage: Math.ceil(countBlogs / blogPerPage)
        };
        
        res.render('admin/dashboard', {
            pageTitle: 'صفحه داشبورد',
            path: '/dashboard',
            layout: './layouts/adminlayout',
            fullName: req.user.fullName,
            blogs,
            formatDate,
            pagination
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }

}

// Upload Image
module.exports.uploadImage = (req, res) => {
    // const fileName = uuid() + path.extname(req.file.fileName);
    const upload = multer({
        limits: {
            fileSize: 4200000,
            files: 1
        },
        // dest: 'uploads/img/',
        // storage,
        fileFilter
    }).single('image');

    upload(req, res, async (err) => {
        // this upload just file exist
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') { // limit : fileSize
                return res.status(400).send('حجم عکس باید کمتر از 4 مگابایت باشد');
            }
            res.status(400).send(err);
        } else {
            if (req.file) {
                const fileName = shortId.generate() + path.extname(req.file.originalname);
                await sharp(req.file.buffer).jpeg({
                    quality: 60
                }).toFile(`./public/uploads/img/${fileName}`)
                    .catch(err => console.log(err));

                const url = `http://localhost:3000/uploads/img/${fileName}`;
                res.status(200).set('url', url).send('آپلود عکس موفقیت آمیز بود');
            }
            else
                res.status(400).send('ابتدا عکسی را انتخاب کنید');
        }
    })
}