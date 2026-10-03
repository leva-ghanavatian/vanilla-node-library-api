const Validator = require("fastest-validator");
const { ObjectId } = require("mongodb");
const { ValidationError } = require("./errors");

const v = new Validator({
	haltOnFirstError: true,
	defaults: { objectID: { ObjectID: ObjectId } }
});

const pick = (schema, fields) => {
	const unknown = fields.find(f => !schema[f]);
	if (unknown) throw new Error(`Unknown field: ${unknown}`);
	return Object.fromEntries(fields.map(f => [f, schema[f]]));
};

const asOptional = schema =>
	Object.fromEntries(
		Object.entries(schema).map(([k, rule]) => [k, { ...rule, optional: true, nullable: false }])
	);

// "remove" drops unknown fields, so the schema stays the single whitelist.
const compile = (schema, { partial = false, allowEmpty = false } = {}) => {
	const check = v.compile({ $$strict: "remove", ...(partial ? asOptional(schema) : schema) });

	return data => {
		const copy = { ...data };          // the checker sanitizes in place, never touch req.body
		const result = check(copy);
		if (result !== true) throw new ValidationError(result[0].message);
		if (partial && !allowEmpty && Object.keys(copy).length === 0) {
			throw new ValidationError(`Provide at least one of: ${Object.keys(schema).join(", ")}`);
		}
		return copy;
	};
};

const createParser = schema => {
	const parseCreate = compile(schema);
	const parseUpdate = compile(schema, { partial: true });
	const parseFilter = compile(schema, { partial: true, allowEmpty: true });
	const cache = new Map();

	return {
		parseCreate,
		parseUpdate,
		parseFilter,
		// compiled once per field combination, not on every request
		parseOnly: (data, only) => {
			const key = only.join(",");
			if (!cache.has(key)) cache.set(key, compile(pick(schema, only)));
			return cache.get(key)(data);
		}
	};
};

const pagination = {
	page: {
		type: "number", integer: true, min: 1, convert: true, default: 1,
		messages: { number: "page must be a positive integer.", numberInteger: "page must be a positive integer.", numberMin: "page must be a positive integer." }
	},
	limit: {
		type: "number", integer: true, min: 1, max: 100, convert: true, default: 20,
		messages: { number: "limit must be between 1 and 100.", numberInteger: "limit must be between 1 and 100.", numberMin: "limit must be between 1 and 100.", numberMax: "limit must be between 1 and 100." }
	}
};

const objectId = label => ({
	type: "objectID",
	convert: true, // string in, ObjectId instance out
	messages: {
		required: `${label} is required.`,
		objectID: `${label} must be a valid id.`
	}
});

module.exports = { createParser, pagination, objectId };