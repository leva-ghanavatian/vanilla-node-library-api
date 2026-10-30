const { createResource } = require("../parsing/resource");
const { objectId } = require("../parsing/id");

module.exports = createResource({
  schema: {
    userId: objectId("userId"),
    bookId: objectId("bookId")
  },
  filterFields: ["userId", "bookId"],
  filterExtras: {
    active:     { type: "boolean", convert: true },
    rentedAt:   { type: "date" },
    returnedAt: { type: "date" },
  },
  sortable: ["rentedAt", "returnedAt", "active"],
  defaultSort: { rentedAt: -1 }
});