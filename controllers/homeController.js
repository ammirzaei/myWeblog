const Blog = require('../models/blogModel');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');


// Home -- GET
module.exports.getHome = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'عمومی' }).sort({ createdAt: 'desc' }); // get all blogs(desc)

        res.render('home/index', {
            pageTitle: 'وبلاگ',
            path: '/',
            blogs,
            formatDate
        });
    } catch (err) {
        console.log(err);
        get500(req, res);
    }
}
