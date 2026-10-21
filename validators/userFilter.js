const { buildFilterParser, filterable } = require("../helpers/filter");
const { buildSortParser } = require("../helpers/sort");
const { userSchema } = require("./user");

const filterSpec = filterable(userSchema, ["name", "username", "email", "crime"], {
	role:      { type: "string", enum: ["USER", "ADMIN"] },
	createdAt: { type: "date" }
});

module.exports = {
	parseUserFilter: buildFilterParser(filterSpec),
	parseUserSort: buildSortParser(["name", "username", "crime", "createdAt"])
};