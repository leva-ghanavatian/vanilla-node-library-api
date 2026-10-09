const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const { requireAuth, requireAdmin } = require("../middlewares/auth");
const userCont = require("../controllers/userCont");

const router = express.Router();

router.get("/", requireAuth, requireAdmin, byId(userCont.getUser, userCont.getAllUsers));
router.post("/", requireJsonBody, userCont.registerUser);
router.get("/me", requireAuth, userCont.getMe);
router.post("/login", requireJsonBody, userCont.loginUser);
router.put("/upgrade", requireAuth, requireAdmin, userCont.upgradeUser);
router.put("/", requireAuth, requireAdmin, requireJsonBody, userCont.updateCrime);
router.delete("/", requireAuth, requireAdmin, userCont.deleteUser);

module.exports = router;