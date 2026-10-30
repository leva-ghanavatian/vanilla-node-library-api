const Validator = require("fastest-validator");
const { ObjectId } = require("mongodb");

const v = new Validator({
	haltOnFirstError: true,
	defaults: { objectID: { ObjectID: ObjectId } }
});

module.exports = { v };