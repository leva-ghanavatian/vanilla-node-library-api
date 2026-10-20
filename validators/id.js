const { createParser } = require("../helpers/validation");

const objectId = label => ({
	type: "objectID",
	convert: true, // string in, ObjectId instance out
	messages: {
		required: `${label} is required.`,
		objectID: `${label} must be a valid id.`
	}
});

const idInput = createParser({ id: objectId("id") });

module.exports = { objectId, parseId: value => idInput.parseCreate({ id: value }).id };