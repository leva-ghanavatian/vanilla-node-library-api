const { createParser, pagination, objectId } = require("../helpers/validation");

const rentInput = createParser({
	userId: objectId("userId"),
	bookId: objectId("bookId"),
	active: {
		type: "boolean",
		convert: true,
		messages: { boolean: "active must be true or false" }
	},
	...pagination
});

module.exports = {
	parseFilters: rentInput.parseFilter,                                  
	parseRentIds: data => rentInput.parseOnly(data, ["userId", "bookId"]),  
	parseBookId: data => rentInput.parseOnly(data, ["bookId"])
};