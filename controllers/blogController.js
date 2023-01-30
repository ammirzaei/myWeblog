const Blog = require('../models/blogModel');

const { formatDate } = require('../utils/jalali');
const { get500, get404 } = require('./errorController');


module.exports.getBlog = async (req, res) => {
    try {
        const blogID = req.params.id; // access with blog ID

        const blog = await Blog.findOne({ id: blogID }).populate('user'); // find blog with blog ID

        if (blog && blog.status === 'عمومی')
            res.status(200).json({ blog });
        else
            res.status(404).json({ message: 'Not found blog', error: err });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}