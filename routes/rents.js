const express = require("express");
const rentCont = require("../controllers/rentCont");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", requireAuth, requireAdmin, rentCont.getAllRents);
router.post("/", requireAuth, rentCont.rentBook);
router.put("/return", requireAuth, rentCont.returnBook);

module.exports = router;