const cloudinary = require('../config/cloudinary')

//To take an image buffer from Multer (req.file.buffer) and upload it to Cloudinary
const uploadImage = (buffer)=>{
    return new Promise ((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: "plants",
            resource_type: "image"
        },(error,result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result); //result contains {secure_url,public_id} 
            }
        })
        uploadStream.end(buffer)
    })
}
module.exports = {uploadImage}