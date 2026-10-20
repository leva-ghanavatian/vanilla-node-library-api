const { createParser } = require("../helpers/validation");
const { schema: pagination } = require("./pagination");
const { objectId } = require("./id");
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