const { createParser } = require("./compile");
const { filterable, buildFilterParser } = require("./filter");
const { buildSortParser } = require("./sort");
const { pick } = require("../core/utils");

const createResource = ({
  schema,                          // Write schema
  filterFields = Object.keys(schema),
  filterExtras = {},               // Server-only queryable fields (free, active, role, etc.)
  sortable = Object.keys(schema),
  defaultSort = { createdAt: -1 },
}) => {
  const input = createParser(schema);
  const filterSchema = {
    ...pick(schema, filterFields),
    ...filterExtras
  };

  return {
    schema,
    parseCreate: input.parseCreate,
    parseUpdate: input.parseUpdate,
    parseOnly: input.parseOnly,

    parseFilter: buildFilterParser(filterSchema),
    parseSort: buildSortParser(sortable, defaultSort),
  };
};

module.exports = { createResource };