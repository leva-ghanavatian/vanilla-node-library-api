const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'public', 'data', 'uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
    };

    if (
        allowedTypes[ext] &&
        file.mimetype === allowedTypes[ext]
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB in bytes
    }
})
module.exports = upload