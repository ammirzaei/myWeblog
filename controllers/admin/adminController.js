const path = require('path');

const sharp = require('sharp');
const shortId = require('shortid');

const rootDir = require('../../utils/rootDir');

// Upload Image
module.exports.uploadImage = async (req, res, next) => {
    try {
        if (req.files) {
            const image = req.files.imageUpload; // access to the image upload

            // Validation
            // Size
            if (image.size > 4200000) {
                const error = new Error('حجم عکس نباید بیشتر از 4 مگابایت باشد');
                error.statusCode = 422;
                throw error;
            }
            // Type
            if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
                const error = new Error('تنها فرمت های JPEG و PNG را میتوانید آپلود کنید');
                error.statusCode = 422;
                throw error;
            }

            const imageName = shortId.generate() + path.extname(image.name);
            const imagePath = `${rootDir}/public/uploads/img/${imageName}`;

            // compressed and saved image to the folder
            await sharp(image.data).jpeg({
                quality: 50
            }).toFile(imagePath).catch((err) => {
                const error = new Error('در فرایند ذخیره عکس مشکلی رخ داد');
                error.data = err;
                throw error;
            });

            // create url image for send on header 
            const url = `${process.env.SITE_URL}/uploads/img/${imageName}`;

            res.status(200).json({ message: 'آپلود عکس با موفقیت انجام شد', url });
        } else {
            const error = new Error('ابتدا عکسی انتخاب کنید');
            error.statusCode = 422;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}