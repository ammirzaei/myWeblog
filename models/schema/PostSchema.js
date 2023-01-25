const { min } = require('jalali-moment');
const yup = require('yup');

module.exports.postValidationSchema = yup.object().shape({
    title : yup.string().required('وارد کردن عنوان پست الزامی است').min(4,'عنوان پست نباید کمتر از 4 کاراکتر باشد').max(150,'عنوان پست نباید بیشتر از 150 کاراکتر باشد'),
    body : yup.string().required('وارد کردن متن پست الزامی است'),
    status : yup.mixed().oneOf(['خصوصی','عمومی'],'یکی از دو وضعیت را انتخاب کنید'),
    // image : yup.string().required('عکس پست الزامی است')
    shortDescription : yup.string().required('وارد کردن توضیحات کوتاه پست الزامی است').min(8,'توضیحات کوتاه پست نباید کمتر از 8 کاراکتر باشد').max(255,'توضیحات کوتاه پست نباید بیشتر از 255 کاراکتر باشد')
});