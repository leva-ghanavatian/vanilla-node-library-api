const express = require("express");
const { requireJsonBody, byId } = require("../middlewares/http");
const userCont = require("../controllers/userCont");

const router = express.Router();

router.get("/",         byId(userCont.getUser, userCont.getAllUsers));
router.post("/",        requireJsonBody, userCont.registerUser);
router.post("/login",   requireJsonBody, userCont.loginUser);
router.put("/upgrade",  userCont.upgradeUser);
router.put("/",         requireJsonBody, userCont.updateCrime);
router.delete("/",      userCont.deleteUser);

module.exports = router;