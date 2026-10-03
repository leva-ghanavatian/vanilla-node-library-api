const { AppError, ValidationError } = require("./errors");

const MAX_BODY_BYTES = 1024 * 1024; // 1 MB

/* ------------------------------ Responses ------------------------------ */

const sendJson = (res, statusCode, data) => {
	res.writeHead(statusCode, { "Content-Type": "application/json" });
	res.end(data === undefined ? undefined : JSON.stringify(data));
};

const sendError = (res, statusCode, message) => {
	sendJson(res, statusCode, { error: message });
};

/* ------------------------------ Requests ------------------------------- */

const readJsonBody = req => new Promise((resolve, reject) => {
	const chunks = [];
	let size = 0;
	let tooLarge = false;

	req.on("data", chunk => {
		if (tooLarge) return;
		size += chunk.length;
		if (size > MAX_BODY_BYTES) {
			tooLarge = true;
			chunks.length = 0;
			reject(new AppError(413, "Request body too large"));
			return;
		}
		chunks.push(chunk);
	});

	req.on("end", () => {
		if (tooLarge) return;
		try {
			const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
			if (body === null || typeof body !== "object" || Array.isArray(body)) {
				return reject(new ValidationError("Request body must be a JSON object"));
			}
			resolve(body);
		} catch {
			reject(new ValidationError("Invalid JSON"));
		}
	});

	req.on("error", reject);
});

const getQuery = req =>
	Object.fromEntries(new URL(req.url, "http://localhost").searchParams);


const getParam = (req, name) =>
	new URL(req.url, "http://localhost").searchParams.get(name);

const getRequiredParam = (req, name) => {
	const value = getParam(req, name);
	if (!value) throw new ValidationError(`Query parameter '${name}' is required`);
	return value;
};

/* ----------------------------- Error handling -------------------------- */

// maps errors to HTTP responses
const handleError = (res, error) => {
	if (error instanceof AppError) return sendError(res, error.status, error.message);
	if (error.code === 11000) return sendError(res, 409, "Resource already exists");
	console.error("Unexpected error:", error);
	sendError(res, 500, "Internal server error");
};

module.exports = {
	sendJson,
	sendError,
	readJsonBody,
	getRequiredParam,
	getQuery,
	getParam,
	handleError
};