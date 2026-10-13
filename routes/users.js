const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const userCont = require("../controllers/userCont");

const router = express.Router();

router.post("/", requireJsonBody, userCont.registerUser);
router.post("/login", requireJsonBody, userCont.loginUser);
router.get("/me", requireAuth, userCont.getMe);          // must stay above "/:id"
router.get("/", requireAuth, requireAdmin, userCont.getAllUsers);
router.get("/:id", requireAuth, requireAdmin, userCont.getUser);
router.patch("/:id/upgrade", requireAuth, requireAdmin, userCont.upgradeUser);
router.patch("/:id", requireAuth, requireAdmin, requireJsonBody, userCont.updateCrime);
router.delete("/:id", requireAuth, requireAdmin, userCont.deleteUser);

module.exports = router;