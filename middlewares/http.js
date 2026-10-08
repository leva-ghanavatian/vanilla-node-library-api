const { AppError, ValidationError } = require("../helpers/errors");

const requireJsonBody = (req, res, next) => {
    const body = req.body;
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return next(new ValidationError("Request body must be a JSON object"));
    }
    next();
};

const notFound = (req, res) => res.status(404).json({ error: "Route not found" });

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
    if (error.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON" });
    if (error.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
    if (error.code === 11000) return res.status(409).json({ error: "Resource already exists" });
    res.status(500).json({ error: "Internal server error" });
};

const byId = (single, list) => (req, res, next) =>
    req.query.id !== undefined ? single(req, res, next) : list(req, res, next);


module.exports = { requireJsonBody, notFound, errorHandler, byId };