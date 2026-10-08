const express = require("express");
const rentCont = require("../controllers/rentCont");

const router = express.Router();

router.get("/",         rentCont.getAllRents);
router.post("/",        rentCont.rentBook);
router.put("/return",   rentCont.returnBook);

module.exports = router;