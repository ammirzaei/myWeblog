const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minlength : 4,
        maxlength : 250
    },
    body : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default : 'عمومی',
        enum : ['عمومی','خصوصی']
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('blog', blogSchema);