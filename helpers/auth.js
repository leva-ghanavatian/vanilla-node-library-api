const jwt = require("jsonwebtoken");

const signToken = user =>
	jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

module.exports = { signToken };