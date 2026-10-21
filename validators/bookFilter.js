const { buildFilterParser, filterable } = require("../helpers/filter");
const { buildSortParser } = require("../helpers/sort");
const { schema } = require("./book");

// `free` is server-controlled so it's absent from the body schema, but it's useful to query on.
const filterSpec = filterable(schema, ["title", "author", "price"], {
	free:      { type: "number", integer: true, min: 0, max: 1 },
	createdAt: { type: "date" }
});

module.exports = {
	parseBookFilter: buildFilterParser(filterSpec),
	parseBookSort: buildSortParser(["title", "author", "price", "createdAt"])
};