const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const bookCont = require("../controllers/bookCont");

const router = express.Router();

router.get("/",     byId(bookCont.getBook, bookCont.getAllBooks));
router.post("/",    requireJsonBody, bookCont.createBook);
router.patch("/",   requireJsonBody, bookCont.updateBook);
router.delete("/",  bookCont.deleteBook);

module.exports = router;