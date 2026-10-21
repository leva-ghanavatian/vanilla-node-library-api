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

const parser = createParser(schema);

module.exports = {
	parsePagination: data => {
		const { page, limit } = parser.parseCreate(data);
		return { page, limit, skip: (page - 1) * limit };
	}
};