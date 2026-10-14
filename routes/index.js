const express = require("express");
const path = require("path");
const upload = require('../middlewares/upload');

const router = express.Router();
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})

router.post('/upload', upload.single('uploaded_file'), (req, res) => {
    // console.log('req.file:', req.file)
    // console.log('req.body:', req.body)
    // console.log('req.headers content-type:', req.headers['content-type'])
    res.sendStatus(200)
})

router.use("/books", require("./books"));
router.use("/users", require("./users"));
router.use("/rents", require("./rents"));

module.exports = router;