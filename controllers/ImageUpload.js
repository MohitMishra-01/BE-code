const cloudinary = require('cloudinary')
require('dotenv').config();
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDNIARY_CLOUD_NAME, 
  api_key: process.env.CLOUDNIARY_API_KEY, 
  api_secret: process.env.CLOUDNIARY_SECRET_KEY
});

const imageUploadController = async(req,res) =>{
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path);
        res.json({
            url:result.secure_url,
            public_id: result.public_id,
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {imageUploadController}