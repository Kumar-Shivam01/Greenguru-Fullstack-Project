const multer = require('multer');
const path = require('path');
const CustomError = require('./../utils/CustomError');

const storage = multer.memoryStorage(); //stores images as buffer in memory, so after Multer processes the image we get req.file.buffer

const fileFilter = (req, file, cb) => {
    const ext = file && file.originalname ? path.extname(file.originalname).toLowerCase() : '';
    const isImageExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
    const isImageMime = file && file.mimetype && file.mimetype.startsWith("image/");

    if (isImageMime || isImageExt) { //returns true if image
        cb(null, true);
    } else {
        cb(new CustomError('Only image files are allowed!', 400), false);
    }
}

const upload = multer({ //Multer instance with storage, fileFilter and limits
    storage,
    fileFilter, //filefilter contains file validation logic eg. checking if it's an image, reject if not
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb limit
    }
}) 

module.exports = upload