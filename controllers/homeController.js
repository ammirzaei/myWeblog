const Blog = require('../models/blogModel');
const Contact = require('../models/contactModel');
const captchapng = require('captchapng');

let Captcha_Num;

// Home -- GET
module.exports.getHome = async (req, res, next) => {
    try {
        // get all blogs(desc)
        const blogs = await Blog.find({ status: 'عمومی' }).sort({ createdAt: 'desc' });

        if (!blogs) {
            const error = new Error('هیچ پستی وجود ندارد');
            error.statusCode = 404;

            throw error;
        }

        res.status(200).json({ blogs, total: blogs.length });
    } catch (err) {
        next(err);
    }
}


// Contact Us -- POST
exports.handleContactUs = async (req, res, next) => {
    try {
        // model validation
        await Contact.contactValidation(req.body);

        await Contact.create({
            ...req.body,
            ipAddress: req.ip
        });

        res.status(200).json({ message: 'پیام شما با موفقیت ثبت شد' });

    } catch (err) {
        const errors = [];

        // errors validation
        err.inner.forEach((error) => {
            errors.push({
                name: error.path,
                message: error.message
            });
        });
        const error = new Error('اعتبارسنجی فیلد ها مشکل دارد');
        error.statusCode = 422;
        error.data = errors;

        next(error);
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