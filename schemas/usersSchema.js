const registerSchema = {
    fullName: {
        type: 'string',
        trim: true,
        max: 150,
        min: 4,
        messages: {
            required: "نام و نام خانوادگی اجباری است",
            stringMin: 'نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد',
            stringMax: 'نام و نام خانوادگی نباید بیشتر از 150 کاراکتر باشد'
        }
    },
    email: {
        type: 'email',
        normalize: true,
        messages: {
            email: 'ایمیل وارد شده معتبر نیست',
            emailEmpty: 'ایمیل اجباری است',
            required: 'ایمیل اجباری است'
        }
    },
    password: {
        type: 'string',
        min: 8,
        max: 150,
        messages: {
            required: 'رمز عبور اجباری است',
            stringMin: 'رمز عبور نباید کمتر از 8 کاراکتر باشد',
            stringMax: 'رمز عبور نباید بیشتر از 150 کاراکتر باشد'
        }
    },
    repassword: {
        type: 'string',
        min: 8,
        max: 150,
        messages: {
            required: 'تکرار رمز عبور اجباری است',
            stringMin: 'تکرار رمز عبور نباید کمتر از 8 کاراکتر باشد',
            stringMax: 'تکرار رمز عبور نباید بیشتر از 150 کاراکتر باشد'
        }
    }
}

module.exports = { registerSchema };