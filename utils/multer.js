const multer = require('multer');

exports.fileFilter = (req,file,cb) => {
    if(file.mimetype != 'image/jpeg'){
        cb(null,true)
    }else {
        cb("We don't support this type of images")
    }
}