const { NotFoundError } = require("./errors");

module.exports = (doc, name) => {
	if (!doc) throw new NotFoundError(`${name} not found`);
	return doc;
};