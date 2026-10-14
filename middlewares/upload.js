const multer = require('multer')
const path = require('path')
//const upload = multer({ dest: './public/data/uploads/' })

const upload = multer({
  dest: path.join(__dirname, '..', 'public', 'data', 'uploads')
})
module.exports = upload