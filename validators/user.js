const { createParser } = require("../helpers/validation");

const PASSWORD_MSG = "Password must be between 8 and 72 characters.";

// Shared shape for trimmed, non-empty strings. Extra rules/messages override the defaults.
const text = (label, rules = {}, messages = {}) => ({
	type: "string", trim: true, empty: false, ...rules,
	messages: {
		required: `${label} is required and cannot be empty.`,
		string: `${label} is required and cannot be empty.`,
		stringEmpty: `${label} is required and cannot be empty.`,
		stringMin: `${label} must be at least {expected} characters.`,
		stringMax: `${label} must be at most {expected} characters.`,
		...messages
	}
});

const userInput = createParser({
	name: text("Name", { max: 100 }),

	username: text("Username",
		{ min: 3, max: 30, pattern: /^[\w.-]+$/ },
		{ stringPattern: "Username may only contain letters, numbers, dots, dashes and underscores." }
	),

	email: {
		type: "email", mode: "precise", normalize: true, max: 254, // normalize = trim + lowercase
		messages: {
			required: "Email is required and cannot be empty.",
			string: "Email is required and cannot be empty.",
			emailEmpty: "Email is required and cannot be empty.",
			email: "Email must be a valid email address.",
			stringMax: "Email must be at most {expected} characters."
		}
	},

	// No `trim`: passwords are kept exactly as typed.
	password: {
		type: "string", min: 8, max: 72,
		// bcrypt silently ignores everything past 72 *bytes*, and multi-byte characters
		// (é, emoji) use more than one byte each, so `max` alone isn't enough.
		custom: (value, errors) => {
			if (typeof value === "string" && Buffer.byteLength(value, "utf8") > 72) {
				errors.push({ type: "passwordBytes", actual: value });
			}
			return value;
		},
		messages: {
			required: PASSWORD_MSG,
			string: PASSWORD_MSG,
			stringMin: PASSWORD_MSG,
			stringMax: PASSWORD_MSG,
			passwordBytes: PASSWORD_MSG
		}
	},

	crime: {
		type: "number", integer: true, min: 0,
		messages: {
			required: "Crime must be a non-negative integer.",
			number: "Crime must be a non-negative integer.",
			numberInteger: "Crime must be a non-negative integer.",
			numberMin: "Crime must be a non-negative integer."
		}
	}
});

module.exports = {
	parseRegistration: data => userInput.parseOnly(data, ["name", "username", "email", "password"]),
	parseLogin: data => userInput.parseOnly(data, ["email", "password"]),
	parseCrime: data => userInput.parseOnly(data, ["crime"])
};