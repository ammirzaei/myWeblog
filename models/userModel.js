const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { registerSchema } = require('./schema/usersSchema');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'نام کامل اجباری است'],
        trim: true,
        minlength: [4, 'حداقل باید 6 کاراکتر وارد کنید'],
        maxlength: [150, 'حداکثر باید 150 کاراکتر وارد کنید']
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
        maxlength: [150, 'حداکثر باید 150 کاراکتر وارد کنید']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.userValidation = function (body) {
    return registerSchema.validate(body, { abortEarly: false });
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    console.log('pre');
    next();
});
userSchema.post('save', function (next){
    console.log('post');
});

module.exports = mongoose.model('user', userSchema);