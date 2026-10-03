const { createParser, isNonEmptyString, trim } = require("../helpers/validation");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const required = label => value =>
	isNonEmptyString(value) ? null : `${label} is required and cannot be empty.`;

const userInput = createParser({
	name: { validate: required("Name"), normalize: trim },
	username: { validate: required("Username"), normalize: trim },
	email: {
		validate: value => {
			if (!isNonEmptyString(value)) return "Email is required and cannot be empty.";
			return EMAIL_RE.test(value.trim()) ? null : "Email must be a valid email address.";
		},
		normalize: value => value.trim().toLowerCase()
	},
	password: {
		validate: v => typeof v === "string" && v.length >= 8 && v.length <= 72
			? null
			: "Password must be between 8 and 72 characters."
	},
	crime: {
		validate: v => Number.isInteger(v) && v >= 0 ? null : "Crime must be a non-negative integer."
	}
});

// What a client may send, per use case.
// Role, crime (on register), timestamps
// and the hash are never accepted from a registration body.
module.exports = {
	parseRegistration: data => userInput.parseOnly(data, ["name", "username", "email", "password"]),
	parseLogin: data => userInput.parseOnly(data, ["email", "password"]),
	parseCrime: data => userInput.parseOnly(data, ["crime"])
};