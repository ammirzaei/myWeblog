const yup = require('yup');

module.exports.addPostSchema = yup.object().shape({
    title : yup.string().required('عنوان پست الزامی است').min(4,'عنوان پست نباید کمتر از 4 کاراکتر باشد').max(250,'عنوان پست نباید بیشتر از 250 کاراکتر باشد'),
    body : yup.string().required('متن پست الزامی است'),
    status : yup.string().required('انتخاب وضعیت پست الزامی است')
});