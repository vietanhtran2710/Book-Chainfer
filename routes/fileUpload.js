const multer = require('multer')
const path = require('path')

module.exports.uploadFile = () => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './files/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '[-]' + file.originalname)
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(new Error('Only pdf file is accepted'), false);
        }
        cb(null, true)
    }

    return multer({ storage: fileStorage})
}