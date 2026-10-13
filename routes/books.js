const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const bookCont = require("../controllers/bookCont");

const router = express.Router();

router.get("/", bookCont.getAllBooks);
router.get("/:id", bookCont.getBook);
router.post("/", requireAuth, requireJsonBody, bookCont.createBook);
router.patch("/:id", requireAuth, requireJsonBody, bookCont.updateBook);
router.delete("/:id", requireAuth, requireAdmin, bookCont.deleteBook);

module.exports = router;