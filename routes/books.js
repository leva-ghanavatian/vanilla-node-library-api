const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const bookCont = require("../controllers/bookCont");

const router = express.Router();

router.get("/", byId(bookCont.getBook, bookCont.getAllBooks));
router.post("/", requireAuth, requireJsonBody, bookCont.createBook);
router.patch("/", requireAuth, requireJsonBody, bookCont.updateBook);
router.delete("/", requireAuth, requireAdmin, bookCont.deleteBook);

module.exports = router;