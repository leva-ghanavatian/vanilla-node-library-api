/* ------------------------------- Validation ---------------------------- */

const { ValidationError } = require("./errors");

const isNonEmptyString = value =>
	typeof value === "string" && value.trim().length > 0;

const isValidPositiveNumber = value =>
	typeof value === "number" && Number.isFinite(value) && value > 0;

const trim = value => value.trim();

// schema: { field: { validate(value) -> errorMessage | null, normalize?(value) } }
// The schema is the single whitelist: unknown fields are dropped.
const createParser = schema => {
	const fields = Object.keys(schema);

	const parse = (data, { partial = false, only = fields } = {}) => {
		const unknown = only.find(f => !schema[f]);
		if (unknown) throw new Error(`Unknown field: ${unknown}`);

		const present = partial ? only.filter(f => data[f] !== undefined) : only;
		if (partial && present.length === 0) {
			throw new ValidationError(`Provide at least one of: ${only.join(", ")}`);
		}

		const result = {};
		for (const field of present) {
			const { validate, normalize = v => v } = schema[field];
			const error = validate(data[field]);
			if (error) throw new ValidationError(error);
			result[field] = normalize(data[field]);
		}
		return result;
	};

	return {
		parseCreate: data => parse(data),
		parseUpdate: data => parse(data, { partial: true }),
		parseOnly: (data, only) => parse(data, { only })
	};
};

module.exports = { createParser, isNonEmptyString, isValidPositiveNumber, trim };
