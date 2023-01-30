const path = require('path');

const sharp = require('sharp');
const shortId = require('shortid');

const Blog = require('../../models/blogModel');
const rootDir = require('../../utils/rootDir');


// Upload Image
module.exports.uploadImage = async (req, res) => {
    try {
        if (req.files) {
            const image = req.files.imageUpload; // access to the image upload

            // Validation
            // Size
            if (image.size > 4200000) {
                return res.status(400).send('حجم عکس نباید بیشتر از 4 مگابایت باشد');
            }
            // Type
            if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
                return res.status(400).send('تنها فرمت های JPEG و PNG را میتوانید آپلود کنید');
            }

            const imageName = shortId.generate() + path.extname(image.name);
            const imagePath = `${rootDir}/public/uploads/img/${imageName}`;

            // compressed and saved image to the folder
            await sharp(image.data).jpeg({
                quality: 50
            }).toFile(imagePath).catch((err) => {
                res.status(400).send('در فرایند ذخیره عکس مشکلی رخ داد');
            });

            // create url image for send on header 
            const url = `http://localhost:3000/uploads/img/${imageName}`;

            res.status(200).set('url', url).send('آپلود عکس با موفقیت انجام شد');
        } else {
            res.status(400).send('ابتدا عکسی انتخاب کنید');
        }
    } catch (err) {
        res.status(400).send('در فرایند آپلود مشکلی رخ داد');
    }
}