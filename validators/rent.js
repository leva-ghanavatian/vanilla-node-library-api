const { createParser } = require("../helpers/validation");
const { buildFilterParser, filterable } = require("../helpers/filter");
const { buildSortParser } = require("../helpers/sort");
const { objectId } = require("./id");

const rentInput = createParser({
	userId: objectId("userId"),
	bookId: objectId("bookId")
});

const filterSpec = filterable(rentInput.schema, ["userId", "bookId"], {
	active: {
		type: "boolean",
		convert: true
	},
	rentedAt:   { type: "date" },
	returnedAt: { type: "date" }
});

module.exports = {
	parseRentFilter: buildFilterParser(filterSpec),
	parseRentSort: buildSortParser(["rentedAt", "returnedAt", "active"], { rentedAt: -1 }),
	parseRentIds: rentInput.parseCreate,
	parseBookId: data => rentInput.parseOnly(data, ["bookId"])
};
