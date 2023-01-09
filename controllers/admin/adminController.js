const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid').v4;

const Blog = require('../../models/blogModel');
const { formatDate } = require('../../utils/jalali');
const { get500 } = require('../errorController');
const { fileFilter, storage } = require('../../utils/multer');


// Dashboard Page -- GET
module.exports.getDashboard = async (req, res) => {
    try {
        const blogs = await Blog.find({
            user: req.user.id
        });
        res.render('admin/dashboard', {
            pageTitle: 'صفحه داشبورد',
            path: '/dashboard',
            layout: './layouts/adminlayout',
            fullName: req.user.fullName,
            blogs,
            formatDate
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
            fieldSize: 4200000,
            files: 1
        },
        // dest: 'uploads/img/',
        // storage,
        fileFilter
    }).single('image');

    upload(req, res, async (err) => {
        // this upload just file exist
        if (err) {
            res.send(err);
        } else {
            if (req.file) {
                const fileName = `${uuid()}_${req.file.originalname}`;
                await sharp(req.file.buffer).jpeg({
                    quality : 60
                }).toFile(`./public/uploads/img/${fileName}`)
                .catch(err => console.log(err));

                res.status(200).send('آپلود عکس موفقیت آمیز بود');
            }
            else
                res.send('ابتدا عکسی را انتخاب کنید');
        }
    })
}