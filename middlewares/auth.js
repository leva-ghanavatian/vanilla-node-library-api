const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../helpers/errors");
const { ROLES } = require("../models/User");

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError());
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedError("Invalid or expired token"));
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN) {
        return next(new ForbiddenError())
    }
    next();
};

module.exports = { requireAuth, requireAdmin };