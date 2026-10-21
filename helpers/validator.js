const Validator = require("fastest-validator");
const { ObjectId } = require("mongodb");

const v = new Validator({
	haltOnFirstError: true,
	defaults: { objectID: { ObjectID: ObjectId } }
});

const pick = (schema, fields) => {
	const unknown = fields.find(f => !schema[f]);
	if (unknown) throw new Error(`Unknown field: ${unknown}`);
	return Object.fromEntries(fields.map(f => [f, schema[f]]));
};

module.exports = { v, pick };