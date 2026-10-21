const { ValidationError } = require("./errors");
const { v, pick } = require("./validator");

const asOptional = schema =>
	Object.fromEntries(
		Object.entries(schema).map(([k, rule]) => [k, { ...rule, optional: true, nullable: false }])
	);

const compile = (schema, { partial = false } = {}) => {
	const check = v.compile({ $$strict: "remove", ...(partial ? asOptional(schema) : schema) });

	return data => {
		const copy = { ...data };
		const result = check(copy);
		if (result !== true) throw new ValidationError(result[0].message);
		if (partial && Object.keys(copy).length === 0) {
			throw new ValidationError(`Provide at least one of: ${Object.keys(schema).join(", ")}`);
		}
		return copy;
	};
};

const createParser = schema => {
	const parseCreate = compile(schema);
	const parseUpdate = compile(schema, { partial: true });
	const cache = new Map();

	return {
		schema,
		parseCreate,
		parseUpdate,
		// compiled once per field combination, not on every request
		parseOnly: (data, only) => {
			const key = only.join(",");
			if (!cache.has(key)) cache.set(key, compile(pick(schema, only)));
			return cache.get(key)(data);
		}
	};
};

module.exports = { createParser };