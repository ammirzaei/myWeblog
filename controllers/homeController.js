const Blog = require('../models/blogModel');
const Contact = require('../models/contactModel');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');
const captchapng = require('captchapng');

let Captcha_Num;

// Home -- GET
module.exports.getHome = async (req, res) => {
    try {
        // get all blogs(desc)
        const blogs = await Blog.find({ status: 'عمومی' }).sort({ createdAt: 'desc' });

        res.status(200).json({ blogs, total: blogs.length });
    } catch (err) {
        res.status(500).json({ error: err });
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

    try {
        // model validation
        await Contact.contactValidation(req.body);

        await Contact.create({
            ...req.body,
            ipAddress: req.ip
        });

        res.status(200).json({ message: 'created success' });

    } catch (err) {
        const errors = [];

        // errors validation
        err.inner.forEach((error) => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });
        res.status(422).json({ errors });
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