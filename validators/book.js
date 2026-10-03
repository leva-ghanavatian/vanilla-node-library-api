const { createParser } = require("../helpers/validation");

// `free` is intentionally absent: it is controlled by the server (rent/return).
module.exports = createParser({
	title: {
		type: "string", trim: true, empty: false, max: 200,
		messages: {
			string: "Title is required to be string and cannot be empty.",
			stringEmpty: "Title is required to be string and cannot be empty.",
			stringMax: "Title must be at most {expected} characters."
		}
	},
	author: {
		type: "string", trim: true, empty: false, max: 200,
		messages: {
			string: "Author is required to be string and cannot be empty.",
			stringEmpty: "Author is required to be string and cannot be empty.",
			stringMax: "Author must be at most {expected} characters."
		}
	},
	price: {
		type: "number", positive: true, max: 100000,
		messages: { number: "Price must be a positive number.", numberPositive: "Price must be a positive number." }
	}
});