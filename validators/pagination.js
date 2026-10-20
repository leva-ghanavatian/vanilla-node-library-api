const { createParser } = require("../helpers/validation");

const msg = text => ({ number: text, numberInteger: text, numberMin: text, numberMax: text });

const schema = {
	page: {
		type: "number", integer: true, min: 1, convert: true, default: 1,
		messages: msg("page must be a positive integer.")
	},
	limit: {
		type: "number", integer: true, min: 1, max: 100, convert: true, default: 20,
		messages: msg("limit must be between 1 and 100.")
	}
};

// `schema` is exported so other validators (rent) can embed the same fields.
module.exports = { schema, ...createParser(schema) };