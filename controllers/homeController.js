const Blog = require('../models/blogModel');
const { formatDate } = require('../utils/jalali');
const { get500 } = require('./errorController');


// Home -- GET
module.exports.getHome = async (req, res) => {
    try {
        const pageId = +req.query.pageId || 1;
        const blogPerPage = 2;

        const countBlogs = await Blog.count({status: 'عمومی'});
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
