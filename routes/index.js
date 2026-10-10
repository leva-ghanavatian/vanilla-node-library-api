const express = require("express");
const path = require("path");
const router = express.Router();
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,  "..", "views", "index.html"))
})
router.use("/books", require("./books"));
router.use("/users", require("./users"));
router.use("/rents", require("./rents"));

module.exports = router;