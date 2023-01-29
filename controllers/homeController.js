const Blog = require('../models/blogModel');
const Contact = require('../models/contactModel');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');
const captchapng = require('captchapng');

let Captcha_Num;

// Home -- GET
module.exports.getHome = async (req, res) => {
    try {
        const pageId = +req.query.pageId || 1;
        const blogPerPage = 2;

        const countBlogs = await Blog.count({ status: 'عمومی'});
        // get all blogs(desc)
        const blogs = await Blog.find({ status: 'عمومی' }).sort({ createdAt: 'desc' })
            .skip((pageId - 1) * blogPerPage)
            .limit(blogPerPage);

        const pagination = {
            currentPage: pageId,
            nextPage: pageId + 1,
            previousPage: pageId - 1,
            hasNextPage: (pageId * blogPerPage) < countBlogs,
            hasPreviousPage: pageId > 1,
            lastPage: Math.ceil(countBlogs / blogPerPage)
        };

        res.render('home/index', {
            pageTitle: 'وبلاگ',
            path: '/',
            blogs,
            formatDate,
            pagination
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}

// Contact Us -- GET
module.exports.getContactUs = (req, res) => {
    res.render('home/contactUs', {
        pageTitle: 'تماس با ما',
        path: '/contact-us',
        success: req.flash('Success'),
        error: req.flash('Error'),
        errors: []
    });
}

// Contact Us -- POST
exports.handleContactUs = async (req, res) => {
    const errors = [];

    try {
        const captcha = Number(req.body.captcha);
        if (captcha) {
            if (captcha !== Captcha_Num) {
                errors.push({
                    name: 'captcha',
                    message: 'کد امنیتی صحیح نیست'
                });

                throw new Error();
            }
        }else {
            errors.push({
                name: 'captcha',
                message: 'وارد کردن کد امنیتی اجباری است'
            });

            throw new Error();
        }

        // model validation
        await Contact.contactValidation(req.body);

        await Contact.create({
            ...req.body,
            ipAddress: req.ip
        });

        req.flash('Success', 'پیام شما با موفقیت ثبت شد');
        res.redirect('/contact-us');

    } catch (err) {
        if (errors.length === 0) {
            // errors validation
            err.inner.forEach((error) => {
                errors.push({
                    name: error.path,
                    message: error.message
                });
            });
        }

        Captcha_Num = Math.floor(Math.random() * 100000); // set number captcha

        res.render('home/contactUs', {
            pageTitle: 'تماس با ما',
            path: '/contact-us',
            success: req.flash('Success'),
            error: req.flash('Error'),
            errors
        });
    }
}

// Numeric Captcha -- GET
exports.getCaptcha = (req, res) => {
    Captcha_Num = Math.floor(Math.random() * 100000); // set number

    const captcha = new captchapng(80, 40, Captcha_Num);
    captcha.color(0, 0, 0, 0);
    captcha.color(80, 80, 80, 255);

    const img = captcha.getBase64();
    const imgBase64 = Buffer.from(img, 'base64');

    res.send(imgBase64);
}