const Blog = require('../models/blogModel');

module.exports.getBlog = async (req, res, next) => {
    try {
        const blogID = req.params.id; // access with blog ID
        
        const blog = await Blog.findOne({ _id: blogID }).populate("user"); // find blog with blog ID
       
        if (blog && blog.status === 'عمومی')
            res.status(200).json({ blog });
        else {
            const error = new Error('پستی پیدا نشد');
            error.statusCode = 404;

            throw error;
        }
    } catch (err) {
        next(err);
    }
}