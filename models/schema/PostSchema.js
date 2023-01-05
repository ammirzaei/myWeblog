const yup = require('yup');

module.exports.addPostSchema = yup.object().shape({
    title : yup.string().required('عنوان پست الزامی است').min(4,'عنوان پست نباید کمتر از 4 کاراکتر باشد').max(150,'عنوان پست نباید بیشتر از 150 کاراکتر باشد'),
    body : yup.string().required('متن پست الزامی است'),
    status : yup.mixed().oneOf(['خصوصی','عمومی'],'یکی از دو وضعیت را انتخاب کنید')
});