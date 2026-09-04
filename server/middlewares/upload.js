const multer = require('multer');
const CustomError = require('./../utils/CustomError')

const storage = multer.memoryStorage(); //stores images as buffer in memory, so after Multer processes the image we get req.file.buffer

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startWith("/image")){ //only allow images (like jpeg, png, gif, webp, and svg)
        cb(null,true);
    }else{  //reject the file and return an error
        cb(new CustomError('Only image files are allowed!',400),false)
    }
}

const upload = multer({ //Multer instance with storage, fileFilter and limits
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb limit
    }
})

module.exports = upload