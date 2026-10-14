const { AppError, ValidationError } = require("../helpers/errors");
const multer = require('multer');
const omitEmptyFunc = require("omit-empty");
const camelcaseKeys = (...args) =>
    import("camelcase-keys").then(
        ({ default: camelcase }) => camelcase(...args)
    );

const omitEmptyFields0 = (req, res, next) => { // route.use(omitEmptyFields)
    req.body = omitEmptyFunc(req.body);
    next()
}
const omitEmptyFields1 = (options) => { // like options = {omitZero : true} route.use(omitEmptyFields({option}))
    return (req, res, next) => {
        req.body = omitEmptyFunc(req.body);
        next()
    }
}

const omitEmptyFields = (options = {}) => {
    return (req, res, next) => {
        req.body = omitEmptyFunc(req.body, options);
        next();
    };
};

const camelcase = async (req, res, next) => {
    //console.log("[CAMELCASE] req.body BEFORE:", req.body);
    req.body = await camelcaseKeys(req.body, { deep: true });
    //console.log("[CAMELCASE] req.body AFTER:", req.body);

    //console.log("[CAMELCASE] req.params BEFORE:", req.params);
    req.params = await camelcaseKeys(req.params);
    //console.log("[CAMELCASE] req.params AFTER:", req.params);

    //console.log("[CAMELCASE] req.query BEFORE:", req.query);
    req.query = await camelcaseKeys(req.query);
    //console.log("[CAMELCASE] req.query AFTER:", req.query);

    next();
};

const requireJsonBody = (req, res, next) => {
    const body = req.body;
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
        return next(new ValidationError("Request body must be a JSON object"));
    }
    next();
};

const notFound = (req, res) => res.status(404).json({ error: "Route not found" });

const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof AppError) return res.status(error.status).json({ error: error.message });
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                error: 'Photo must not exceed 5 MB'
            });
        }

        return res.status(400).json({
            error: error.message
        });
    }
    if (error.message === 'Invalid file type')
        return res.status(400).json({ error: error.message });

    if (error.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON" });
    if (error.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
    if (error.code === 11000) return res.status(409).json({ error: "Resource already exists" });
    res.status(500).json({ error: "Internal server error" });
};

const byId = (single, list) => (req, res, next) =>
    req.query.id !== undefined ? single(req, res, next) : list(req, res, next);


module.exports = { omitEmptyFields, camelcase, requireJsonBody, notFound, errorHandler, byId }; 