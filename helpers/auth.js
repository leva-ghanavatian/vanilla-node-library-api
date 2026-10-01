// const jwt = require("jsonwebtoken");
// const { UnauthorizedError, ForbiddenError } = require("./errors");
// const { ROLES } = require("../models/User");

// const requireAuth = req => {
//     const token = (req.headers.authorization || "").replace(/^Bearer /, "");
//     try { return jwt.verify(token, process.env.JWT_SECRET); }
//     catch { throw new UnauthorizedError("Missing or invalid token"); }
// };

// const requireAdmin = req => {
//     const payload = requireAuth(req);
//     if (payload.role !== ROLES.ADMIN) throw new ForbiddenError("Admins only");
//     return payload;
// };

// module.exports = { requireAuth, requireAdmin };

const jwt = require("jsonwebtoken");

const signToken = user =>
	jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

module.exports = { signToken };