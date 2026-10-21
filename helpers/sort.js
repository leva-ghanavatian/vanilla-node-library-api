const { ValidationError } = require("./errors");

const buildSortParser = (sortable, fallback = { createdAt: -1 }) => (raw) => {
  if (!raw) return fallback;
  const sort = {};
  for (const token of String(raw).split(",")) {
    const desc = token.startsWith("-");
    const field = desc ? token.slice(1) : token;
    if (!sortable.includes(field)) throw new ValidationError(`Cannot sort by "${field}"`);
    sort[field] = desc ? -1 : 1;
  }
  return sort;
};

module.exports = { buildSortParser }