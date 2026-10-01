const { ValidationError } = require("../helpers/errors");

const parseActive = value => {
	if (value === undefined) return undefined; // filter not provided
	if (value !== "true" && value !== "false") {
		throw new ValidationError("active must be true or false");
	}
	return value === "true";
};

const parseFilters = query => ({
	userId: query.userId,
	bookId: query.bookId,
	active: parseActive(query.active)
});

module.exports = { parseFilters };