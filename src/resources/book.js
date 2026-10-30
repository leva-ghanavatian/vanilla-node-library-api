const { createResource } = require("../parsing/resource");

module.exports = createResource({
  schema: {
    title: {
      type: "string", trim: true, empty: false, max: 200,
      messages: {
        string: "Title is required to be string and cannot be empty.",
        stringEmpty: "Title is required to be string and cannot be empty.",
        stringMax: "Title must be at most {expected} characters."
      }
    },
    author: {
      type: "string", trim: true, empty: false, max: 200,
      messages: {
        string: "Author is required to be string and cannot be empty.",
        stringEmpty: "Author is required to be string and cannot be empty.",
        stringMax: "Author must be at most {expected} characters."
      }
    },
    price: {
      type: "number", positive: true, max: 100000,
      messages: { number: "Price must be a positive number.", numberPositive: "Price must be a positive number." }
    }
  },
  filterExtras: {
    free:      { type: "number", integer: true, min: 0, max: 1 },
    createdAt: { type: "date" },
  },
  sortable: ["title", "author", "price", "createdAt"]
});