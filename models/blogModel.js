const mongoose = require('mongoose');


const { addPostSchema } = require('./schema/PostSchema');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'عمومی',
        enum: ['عمومی', 'خصوصی']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

blogSchema.statics.addPostValidation = function (body) {
    return addPostSchema.validate(body, { abortEarly: false });
}

module.exports = mongoose.model('blog', blogSchema);