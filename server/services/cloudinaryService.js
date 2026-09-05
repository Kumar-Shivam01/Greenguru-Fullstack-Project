const cloudinary = require('../config/cloudinary')

//To take an image buffer from Multer (req.file.buffer) and upload it to Cloudinary
const uploadImage = (buffer)=>{
    return new Promise ((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({  //returns a writable stream that you feed data into; Cloudinary reads from that stream and uploads as data arrives.
            folder: "plants",
            resource_type: "image"
        },(error,result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result); //result contains {secure_url,public_id} 
            }
        })
        uploadStream.end(buffer) //push buffer into the stream so Cloudinary can start uploading.
    })
}
module.exports = {uploadImage}