const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'نام کامل اجباری است'],
        trim: true,
        minlength: [6, 'حداقل باید 6 کاراکتر وارد کنید'],
        maxLength: [150, 'حداکثر باید 150 کاراکتر وارد کنید']
    },
    email: {
        type: String,
        required: [true, 'ایمیل اجباری است'],
        unique: [true, 'ایمیل تکراری است']
    },
    password: {
        type: String,
        required: [true, 'رمز عبور اجباری است'],
        minlength: [8, 'حداقل باید 8 کاراکتر وارد کنید'],
        maxLength: [150, 'حداکثر باید 150 کاراکتر وارد کنید']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', userSchema);