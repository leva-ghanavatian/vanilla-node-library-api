const express = require("express");

const router = express.Router();

router.use("/books", require("./books"));
router.use("/users", require("./users"));
router.use("/rents", require("./rents"));

module.exports = router;