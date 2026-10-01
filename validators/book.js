const { createParser, isNonEmptyString, isValidPositiveNumber, trim } = require("../helpers/validation");

// `free` is intentionally absent: it is controlled by the server (rent/return).
module.exports = createParser({
	title: {
		validate: v => isNonEmptyString(v) ? null : "Title is required to be string and cannot be empty.",
		normalize: trim
	},
	author: {
		validate: v => isNonEmptyString(v) ? null : "Author is required to be string and cannot be empty.",
		normalize: trim
	},
	price: {
		validate: v => isValidPositiveNumber(v) ? null : "Price must be a positive number."
	}
});